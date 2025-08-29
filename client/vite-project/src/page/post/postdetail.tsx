import React, { useEffect, useRef, useState } from 'react';
import { Share, Bold, Italic, List, ListOrdered, Image, Smile, Paperclip, MoreHorizontal, SendHorizonal, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchPostById } from '../../features/post/postAPI';
import { Link, useParams } from 'react-router-dom';
import type { IPost } from '../../types/post.t';
import dayjs from 'dayjs';
import { createComment, fetchCommentsByPost, updateCommentImage } from '../../features/comment/commentAPI';
import type { IComment } from '../../types/comment.t';
import type { UploadedImage } from '../../types/upload.t';
import { createReply, fetchReplys } from '../../features/reply/replyAPI';
import type { IReplys } from '../../types/reply.t';
import type { User } from '../../types/user.t';
import { getCurrentUser } from '../../features/user/userAPI';
import toast from 'react-hot-toast';

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState<IPost | null>(null);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<IComment[]>([]);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [replyTexts, setReplyTexts] = useState<{ [commentId: string]: string }>({});
    const [replies, setReplies] = useState<{ [commentId: string]: IReplys[] }>({});
    const [activeReplyBox, setActiveReplyBox] = useState<string | null>(null);
    const [hiddenReplies, setHiddenReplies] = useState<{ [commentId: string]: boolean }>({});
    const [userData, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);




    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const me = await getCurrentUser();
                setCurrentUser(me);
            } catch (err) {
                setCurrentUser(null);
            }
        }
        fetchUser()
    }, [])

    // console.log("user: ", userData?.username)

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        if (!id) return;

        fetchPostById(id)
            .then((data) => {
                setPost(data);
            })
            .catch((err) => {
                console.error('❌ Fetch post error:', err);
            })
        fetchCommentsByPost(id).then(setComments).catch(console.error);
    }, [id]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newImages: UploadedImage[] = Array.from(e.target.files).map((file) => ({
            id: Date.now() + Math.random(),
            file,
            preview: URL.createObjectURL(file)
        }));
        setUploadedImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (id: number) => {
        setUploadedImages(prev => prev.filter(img => img.id !== id));
    };

    const handleSubmitComment = async () => {
        if (isLoading) return;

        const hasText = commentText.trim().length > 0;
        const hasImage = uploadedImages.length > 0;

        if (!hasText && !hasImage) {
            return toast.error("กรุณากรอกข้อความหรือเลือกรูปภาพก่อนส่ง");
        }

        if (!id) return toast.error("ไม่พบโพสต์เป้าหมาย");

        setIsLoading(true);

        try {
            const newComment = await createComment({
                content: hasText ? commentText : "",
                postId: id,
            });

            if (hasImage) {
                const formData = new FormData();
                formData.append("image", uploadedImages[0].file);
                const commentId = (newComment as any)._id || (newComment as any).id;
                if (commentId) await updateCommentImage(commentId, formData);
            }

            setCommentText("");
            setUploadedImages([]);
            const updatedComments = await fetchCommentsByPost(id);
            setComments(updatedComments);
        } catch (err) {
            console.error("❌ Failed to comment:", err);
            toast.error("เกิดข้อผิดพลาดขณะส่งคอมเมนต์");
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        const loadReplies = async () => {
            for (const comment of comments) {
                const replyList = await fetchReplys(comment.id);
                setReplies(prev => ({ ...prev, [comment.id]: replyList }));
            }
        };

        loadReplies();
    }, [comments]);

    const handleReply = async (commentId: string) => {
        const content = replyTexts[commentId];
        if (!content?.trim()) return;

        try {
            await createReply({ commentId, content, contentImage: "" });

            setReplyTexts(prev => ({ ...prev, [commentId]: "" }));
            const updatedReplies = await fetchReplys(commentId);
            setReplies(prev => ({ ...prev, [commentId]: updatedReplies }));
        } catch (err) {
            toast.error("กรุณาเข้าสู่ระบบ")
            console.error("❌ Reply failed:", err);
        }
    };
    console.log(replies)


    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 px-6 py-4 border-b border-t border-gray-700">
                <div className="flex items-center space-x-3 text-gray-400">
                    <Link to="/post">
                        <span className="hover:text-white cursor-pointer">Post</span>
                    </Link>
                    <span>&gt;</span>
                    <span className="hover:text-white cursor-pointer">{post?.categories}</span>
                    <span>&gt;</span>
                    <span className="text-white">{post?.title}</span>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-6 py-8">

                <div className="flex items-start space-x-4 mb-6">
                    <img className='w-16 h-16 bg-gray-600 rounded-full' src={post?.user.avatar} alt={post?.user.avatar} />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <Link to={`/profile/${post?.user._id}`}>
                                    <h3 className="hover:text-blue-500 text-gray-300 font-medium">{post?.user.name}</h3>
                                </Link>
                                <p className="text-gray-500 text-sm"> {dayjs(post?.createdAt).fromNow()}</p>
                            </div>
                            <button className="flex items-center space-x-2 text-gray-400 hover:text-white">
                                <Share className="w-4 h-4" />
                                <span className="text-sm">Share</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <p className="text-gray-200 leading-relaxed">
                        {post?.postContent}
                        <img className='w-lg h-auto mt-5' src={post?.postImage} alt={post?.id} />
                    </p>
                </div>
                <div className="border-t border-gray-700 pt-6">
                    <h2 className="text-xl font-semibold mb-6">
                        Discussion {comments.length + Object.values(replies).reduce((acc, arr) => acc + arr.length, 0)}
                    </h2>


                    <div className="bg-gray-800 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
                            <div className="flex items-center space-x-3">
                                <button className="text-gray-400 hover:text-white">
                                    <Bold className="w-4 h-4" />
                                </button>
                                <button className="text-gray-400 hover:text-white">
                                    <Italic className="w-4 h-4" />
                                </button>
                                <button className="text-gray-400 hover:text-white">
                                    <List className="w-4 h-4" />
                                </button>
                                <button className="text-gray-400 hover:text-white">
                                    <ListOrdered className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={triggerFileSelect}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <Image className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button className="text-gray-400 hover:text-white">
                                    <Smile className="w-4 h-4" />
                                </button>
                                <button className="text-gray-400 hover:text-white">
                                    <Paperclip className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="w-full h-22   bg-transparent text-gray-200 placeholder-gray-500 resize-none outline-none"
                            placeholder="Write your comment..."
                        />

                        <div className="flex gap-2 mt-3 flex-wrap">
                            {uploadedImages.map(img => (
                                <div key={img.id} className="relative">
                                    <img
                                        src={img.preview}
                                        alt="preview"
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    <button
                                        onClick={() => removeImage(img.id)}
                                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleSubmitComment}
                            disabled={isLoading}
                            className={`mt-5 px-6 py-2 rounded-full font-medium transition-colors text-white 
    ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isLoading ? 'กำลังส่ง...' : 'Submit'}
                        </button>

                    </div>



                    {/* Comment Section */}
                    {comments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-4 mb-10">
                            <img className="w-10 h-10 rounded-full" src={comment.user.avatar} alt="avatar" />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center space-x-2">
                                        <Link to={`/profile/${comment.user._id}`}>
                                            <span className="hover:text-blue-500 text-gray-300 font-medium">{comment.user.name}</span>
                                        </Link>
                                        <span className="text-gray-500 text-sm">• {dayjs(comment.createdAt).fromNow()}</span>
                                    </div>
                                    <MoreHorizontal className="w-4 h-4 text-gray-400 hover:text-white" />
                                </div>

                                <p className="text-gray-200">{comment.content}</p>
                                {comment.commentImage && (
                                    <img src={comment.commentImage} alt="comment" className="rounded-lg mt-2 max-w-xs" />
                                )}

                                <div className="mt-2 flex items-center justify-between mb-3">
                                    <button className="flex items-center space-x-2 text-gray-400 hover:text-red-400">
                                        <Heart size={18} />
                                        <span>0</span>
                                    </button>

                                    <button
                                        onClick={() =>
                                            setActiveReplyBox(prev => (prev === comment.id ? null : comment.id))
                                        }
                                        className="text-sm text-blue-400 hover:underline"
                                    >
                                        {activeReplyBox === comment.id ? 'Cancel' : 'Reply'}
                                    </button>
                                </div>

                                {activeReplyBox === comment.id && (
                                    <div className="mt-3 flex items-start space-x-3">
                                        <img
                                            className="w-8 h-8 rounded-full"
                                            src={userData?.profileImage || "/default-avatar.png"}
                                            alt="your avatar"
                                        />
                                        <div className="flex-1 relative">
                                            <textarea
                                                className="w-full bg-[#1e293b] text-white p-3  pr-12 rounded-md border border-gray-600 focus:outline-none focus:ring focus:border-blue-400"
                                                rows={2}
                                                placeholder={`@${comment.user.name},`}
                                                value={replyTexts[comment.id] || ""}
                                                onChange={(e) =>
                                                    setReplyTexts({ ...replyTexts, [comment.id]: e.target.value })
                                                }
                                            />
                                            <button
                                                onClick={() => handleReply(comment.id)}
                                                className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md mb-1.5 "
                                            >
                                                <SendHorizonal size={12} />
                                            </button>
                                        </div>
                                    </div>

                                )}

                                {replies[comment.id]?.length > 0 && (
                                    <button
                                        onClick={() =>
                                            setHiddenReplies(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))
                                        }
                                        className="mt-2 text-sm text-gray-400 hover:text-white flex items-center space-x-1"
                                    >
                                        {hiddenReplies[comment.id] ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                        <span>
                                            {hiddenReplies[comment.id] ? 'Show Replies' : 'Hide Replies'} ({replies[comment.id].length})
                                        </span>
                                    </button>
                                )}

                                {!hiddenReplies[comment.id] &&
                                    replies[comment.id]?.map(reply => (
                                        <div key={reply.id} className="ml-14 mt-5 flex items-start space-x-3">
                                            <img className="w-8 h-8 rounded-full" src={reply.user.avatar} alt="avatar" />
                                            <div className="bg-gray-800 rounded-lg p-3 w-full">
                                                <Link to={`/profile/${reply.user._id}`}>
                                                    <div className="hover:text-blue-500 text-sm text-gray-300 font-medium">{reply.user.name}</div>
                                                </Link>
                                                <div className="text-gray-200">{reply.content}</div>
                                                <div className="text-xs text-gray-500">{dayjs(reply.createdAt).fromNow()}</div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


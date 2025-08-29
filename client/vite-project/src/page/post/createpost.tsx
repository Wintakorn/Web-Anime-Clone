import { useState } from 'react';
import {
  ArrowLeft,
  Bold,
  Italic,
  List,
  ListOrdered,
  Image,
  Smile,
  FileText,
  Send,
  X
} from 'lucide-react';
import { createPost, updatePost, updatePostImage } from '../../features/post/postAPI';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import type { UploadedImage } from '../../types/upload.t';
import { categoriesPost } from '../../utils/categories';
import toast from 'react-hot-toast';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Anything Else');
  const [postType, setPostType] = useState('Text');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const navigate = useNavigate();

  const handleFileUpload = (files: FileList) => {
    const newImages: UploadedImage[] = Array.from(files).map((file: File) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file)
    }));
    setUploadedImages((prev: UploadedImage[]) => [...prev, ...newImages]);
  };

  interface RemoveImageFn {
    (imageId: number): void;
  }

  const removeImage: RemoveImageFn = (imageId) => {
    setUploadedImages((prev: UploadedImage[]) => prev.filter((img: UploadedImage) => img.id !== imageId));
  };

  const handleSubmitPost = async () => {
    if (!title.trim() || (postType === 'Text' ? !content.trim() : uploadedImages.length === 0)) return;

    try {
      const newPost = await createPost({
        title,
        postContent: content,
        postImage: '',
        categories: [selectedCategory]
      });
      if (uploadedImages.length > 0) {
        const formData = new FormData();
        formData.append('image', uploadedImages[0].file);
        const postId = (newPost as any).id || (newPost as any)._id || (newPost as any).postId;
        if (!postId) {
          throw new Error('Post ID not found in createPost response');
        }
        const { postImage } = await updatePostImage(postId, formData);
        await updatePost(postId, { postImage });
      }
      toast.success("สร้างโพสสำเร็จ")
      navigate('/post');
      
    } catch (err) {
      console.error('❌ Failed to submit post:', err);
      toast.error('กรุณาเข้าสู่ระบบก่อนจ้าา');
    }
  };

  return (
    <div className="bg-gray-900 text-white p-5 m-8 rounded">
      <div className="mx-auto p-6">
        <div className="flex items-center mb-8">
          <Link to="/post">
            <button className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors mr-4">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <h1 className="text-2xl font-bold">Create Post</h1>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Title*"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                maxLength={200}
              />
              <div className="absolute right-3 top-3 text-sm text-gray-400">
                {title.length}/200
              </div>
            </div>

            <div className="w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
              >
                {categoriesPost.map((category) => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="postType"
                value="Text"
                checked={postType === 'Text'}
                onChange={(e) => setPostType(e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 focus:ring-blue-500"
              />
              <span>Text</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="postType"
                value="Images"
                checked={postType === 'Images'}
                onChange={(e) => setPostType(e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 focus:ring-blue-500"
              />
              <span>Images</span>
            </label>
          </div>

          {postType === 'Text' ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-700 rounded transition-colors">
                    <Bold size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-700 rounded transition-colors">
                    <Italic size={18} />
                  </button>
                  <div className="w-px h-6 bg-gray-600 mx-2"></div>
                  <button className="p-2 hover:bg-gray-700 rounded transition-colors">
                    <List size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-700 rounded transition-colors">
                    <ListOrdered size={18} />
                  </button>
                  <div className="w-px h-6 bg-gray-600 mx-2"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-700 rounded transition-colors">
                    <Smile size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-700 rounded transition-colors">
                    <FileText size={18} />
                  </button>
                </div>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-transparent text-white placeholder-gray-400 p-4 min-h-[300px] resize-none focus:outline-none"
                placeholder="What's on your mind?"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg min-h-[150px] flex flex-col items-center justify-center p-6 hover:border-gray-500 transition-colors">
                <div className="text-center">
                  <Image size={32} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-400 text-base">Drag and Drop image(s) here</p>
                  <p className="text-gray-500 text-sm mt-1">or click to browse</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFileUpload(e.target.files);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileUpload(e.dataTransfer.files);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                />
              </div>
              {uploadedImages.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Uploaded Images ({uploadedImages.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.preview}
                          alt="Preview"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                          {image.file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSubmitPost}
              disabled={!title.trim() || (postType === 'Text' ? !content.trim() : uploadedImages.length === 0)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <span>Submit Post</span>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
import express, { Request, Response } from 'express'
import Post from '../model/Post'
import { PostInterface } from '../types/post.interface';
import cloudinary from '../utils/cloudinary';
import Comment from '../model/Comment';

export const CreatePost = async (req: Request<{}, {}, PostInterface>, res: Response) => {
    try {
        const {
            title,
            postImage,
            postContent,
            categories
        } = req.body;
        const userId = req.user?.id

        const newPost = new Post({
            userId,
            categories,
            title,
            postImage,
            postContent
        })

        const savedPost = await newPost.save();
        res.status(201).json({
            message: "Create Post successfully",
            newPost: savedPost
        });

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}


export const fetchPostById = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const fetchpostById = await Post.findById(id)
            .populate('userId', '_id username profileImage role')
            .sort({ createdAt: -1 });

        if (!fetchpostById) {
            return res.status(404).json({ message: "Post not found" });
        }

        const post = {
            id: fetchpostById._id,
            title: fetchpostById.title,
            postImage: fetchpostById.postImage,
            postContent: fetchpostById.postContent,
            categories: fetchpostById.categories,
            createdAt: fetchpostById.createdAt,
            updatedAt: fetchpostById.updatedAt,
            user: {
                _id: (fetchpostById.userId as any)._id,
                name: (fetchpostById.userId as any).username,
                avatar: (fetchpostById.userId as any).profileImage,
                role: (fetchpostById.userId as any).role
            },
        };

        res.status(200).json({
            message: "fetch post by id",
            post: post
        });

    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                message: err.message
            })
        } else {
            res.status(500).json({ message: "Internal server error" });
        }

    }
}

export const updatePostById = async (req: Request<{ id: string }, {}, PostInterface>, res: Response): Promise<void> => {
    try {

        const { id } = req.params;
        const updateData = { ...req.body }

        const updatePost = await Post.findByIdAndUpdate(id,
            updateData, { new: true }
        )
        res.status(200).json({
            message: "update successfully",
            updatePost: updatePost
        })
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                message: err.message
            })
        } else {

            res.status(500).json({ message: "Internal server error" });

        }
    }
}

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletePostById = await Post.findByIdAndDelete(id)

        await res.status(200).json({
            message: "delete successfully",
            deletePostById
        })
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                message: err.message
            })
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const fetchPostall = async (req: Request, res: Response) => {
    try {
        const fetchPosts = await Post.find()
            .populate('userId', '_id username profileImage role')
            .sort({ createdAt: -1 });

            const posts = await Promise.all(fetchPosts.map(async (p) => {
            const commentCount = await Comment.countDocuments({ postId: p._id }); 

            return {
                id: p._id,
                title: p.title,
                postImage: p.postImage,
                postContent: p.postContent,
                categories: p.categories,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
                commentCount, 
                user: {
                    _id: (p.userId as any)._id,
                    name: (p.userId as any).username,
                    avatar: (p.userId as any).profileImage,
                    role: (p.userId as any).role
                },
            };
        }));

        res.status(200).json({
            message: "fetch all post",
            posts: posts
        });
    } catch (err) {
        res.status(500).json({
            message: err instanceof Error ? err.message : "Internal server error"
        });
    }
};



export const updatePostImage = async (req: Request, res: Response) => {
    const postId = req.params.id;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'post_images' },
                (error, result) => {
                    if (result) resolve(result as { secure_url: string });
                    else reject(error);
                }
            );
            stream.end(file.buffer);
        });
        post.postImage = result.secure_url;
        await post.save();

        res.json({
            message: 'Upload success',
            postImage: post.postImage,
        });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};
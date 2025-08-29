import { Request, Response } from "express";
import { commentInterface } from "../types/comment.interface";
import Comment from "../model/Comment";
import cloudinary from "../utils/cloudinary";

export const createComment = async (req: Request<{}, {}, commentInterface>, res: Response): Promise<void> => {
    try {
        const {
            content,
            commentImage,
            postId
        } = req.body
        const userId = req.user?.id
        const create = new Comment({
            userId,
            postId,
            content,
            commentImage
        })

        const saveComment = await create.save();
        res.status(201).json({
            message: "Create comment successfully.",
            newComment: saveComment
        })

    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({
                message: err.message,
            })
        } else {
            res.status(500).json({
                message: "Internal from Server"
            })
        }
    }
}

export const fetchCommentsByPost = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const comments = await Comment.find({ postId: id })
            .populate('userId', '_id username profileImage role')
            .sort({ createdAt: -1 });

        if (!comments || comments.length === 0) {
            return res.status(404).json({ message: "Comments not found" });
        }

        const formatted = comments.map(c => ({
            id: c._id,
            content: c.content,
            commentImage: c.commentImage,
            createdAt: c.createdAt,
            user: {
                _id: (c.userId as any)._id,
                name: (c.userId as any).username,
                avatar: (c.userId as any).profileImage,
                role: (c.userId as any).role
            }
        }));

        res.status(200).json({
            message: "Fetch comments successfully.",
            comments: formatted
        });

    } catch (err: unknown) {
        res.status(500).json({
            message: err instanceof Error ? err.message : "Internal from Server"
        });
    }
};



export const updateCommentImage = async (req: Request, res: Response) => {
    const commentId = req.params.id;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'comment_image' },
                (error, result) => {
                    if (result) resolve(result as { secure_url: string });
                    else reject(error);
                }
            );
            stream.end(file.buffer);
        });
        comment.commentImage = result.secure_url;
        await comment.save();

        res.json({
            message: 'Upload success',
            comment: comment.commentImage,
        });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};
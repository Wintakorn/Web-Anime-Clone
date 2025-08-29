import { Request, Response } from "express"
import { ReplyInterface } from "../types/reply.interface"
import ReplyComment from "../model/ReplyComment";
import cloudinary from "../utils/cloudinary";


export const replyCreate = async (req: Request<{}, {}, ReplyInterface>, res: Response) => {
    try {
        const {
            content,
            contentImage,
            commentId
        } = req.body;
        const userId = req.user?.id
        const createReply = new ReplyComment({
            content,
            contentImage,
            commentId, userId
        })
        const saveReply = await createReply.save();
        res.status(201).json({
            message: "Reply create successfully",
            newreply: saveReply
        })

    } catch (err) {
        res.status(500).json({
            message: err instanceof Error ? err.message : "Internal from Server"
        })
    }
}

export const fetchReplyByComment = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const reply = await ReplyComment.find({ commentId: id })
            .populate('userId', '_id username profileImage')
            .sort({ createdAt: -1 })

        if (!reply) {
            return res.status(404).json({ message: "No reply found for this comment" });
        }

        const formatted = reply.map(r => ({
            id: r._id,
            content: r.content,
            contentImage: r.contentImage,
            createdAt: r.createdAt,
            user: {
                _id: (r.userId as any)._id,
                name: (r.userId as any).username,
                avatar: (r.userId as any).profileImage,
                role: (r.userId as any).role
            }

        }));

        res.status(200).json({
            message: "fetch replys successfully.",
            replys: formatted
        })

    } catch (err) {
        res.status(500).json({
            message: err instanceof Error ? err.message : "Internal from Server"
        })
    }
}


export const updateReplyImage = async (req: Request, res: Response) => {
    const replyId = req.params.id;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const reply = await ReplyComment.findById(replyId);
        if (!reply) return res.status(404).json({ error: 'Comment not found' });

        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'reply_image' },
                (error, result) => {
                    if (result) resolve(result as { secure_url: string });
                    else reject(error);
                }
            );
            stream.end(file.buffer);
        });
        reply.contentImage = result.secure_url;
        await reply.save();

        res.json({
            message: 'Upload success',
            reply: reply.contentImage,
        });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};
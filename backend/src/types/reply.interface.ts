import mongoose from "mongoose";

export interface ReplyInterface {
    userId: mongoose.Types.ObjectId;
    commentId: mongoose.Types.ObjectId;
    content: string;
    contentImage: string;
    createdAt: string;
    updatedAt: string;
}
import mongoose from "mongoose";

export interface commentInterface {
    userId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
    content: string;
    commentImage: string;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
}
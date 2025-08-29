import mongoose from "mongoose";

export interface PostInterface extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    postTopic: string;
    postImage: string;
    postContent: string;
    categories: string[];
    createdAt: string;
    updatedAt: string;
}
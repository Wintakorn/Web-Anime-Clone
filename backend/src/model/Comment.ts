import mongoose from "mongoose";
import { commentInterface } from "../types/comment.interface";

const commentSchema = new mongoose.Schema<commentInterface>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    content: {
        type: String,
    },
    commentImage: {
        type: String,
        default: ""
    },
    commentCount: {
        type: Number,
        default: 0
    }

})

export default mongoose.model<commentInterface>('Comment', commentSchema)


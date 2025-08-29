import mongoose from "mongoose";
import { PostInterface } from "../types/post.interface";


const postSchema = new mongoose.Schema<PostInterface>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: {
        type: String,
        required: true,
    },
    categories: {
        type: [String],
        required: true
    },
    postImage: {
        type: String,
        default: ""
    },
    postContent: {
        type: String,
        default: ""
    },

},
    {
        timestamps: true
    }
);

export default mongoose.model<PostInterface>('Post', postSchema);
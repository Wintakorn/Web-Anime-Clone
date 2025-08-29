import mongoose from 'mongoose'
import { ReplyInterface } from '../types/reply.interface'

const ReplySchema = new mongoose.Schema<ReplyInterface>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Comment'
    },
    content: {
        type: String,
        required: true
    },
    contentImage: {
        type: String,
        default: ""
    }
})

export default mongoose.model<ReplyInterface>('Reply', ReplySchema)
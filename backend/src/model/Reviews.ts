import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  mangaId: mongoose.Types.ObjectId;
  comment: string;
  rating: number;
  createdAt: Date;
  likes: number;
  tagPerson: string;
  likedBy: mongoose.Types.ObjectId[];
}

const reviewSchema = new Schema<IReview>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  mangaId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Manga' },
  tagPerson: {type: String, default: ""},
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  likes: { type: Number, default: 0, required: true },
  likedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [], required: true },

}, { timestamps: true });


export default mongoose.model<IReview>('Review', reviewSchema);

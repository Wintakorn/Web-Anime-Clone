import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  items: [
    {
      mangaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manga', required: true },
      title: String,
      price: Number,
      coverImage: String,
      quantity: { type: Number, default: 1 },
    },
  ],
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);

import { Request, Response } from 'express';
import Reviews, { IReview } from '../model/Reviews';
import User from '../model/User';
import { getUserReviewTags } from '../utils/getUserReviewTags';

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { mangaId } = req.query;
    const filter = mangaId ? { mangaId } : {};

    const reviews = await Reviews.find(filter)
      .populate('userId', '_id username profileImage role')
      .populate('mangaId', '_id title image genre')
      .sort({ createdAt: -1 });

    const result = reviews.map((r) => {
      const userReviews = reviews.filter(rv => (rv.userId as any)?._id?.toString() === (r.userId as any)?._id?.toString());
      const tagPerson = getUserReviewTags(userReviews);
      return {
        id: r._id,
        comment: r.comment,
        rating: r.rating,
        mangaId: r.mangaId,
        createdAt: r.createdAt,
        likes: r.likes,
        liked: req.user?.id ? r.likedBy?.some((uid: any) => uid.toString() === req.user?.id) : false,
        user: {
          _id: (r.userId as any)?._id || '',
          name: (r.userId as any)?.username || 'Unknown',
          avatar: (r.userId as any)?.profileImage || '',
          role: (r.userId as any)?.role || "user",
          tagPerson: tagPerson
        },
        book_manga: {
          _id: (r.mangaId)?._id || "",
          title: (r.mangaId as any)?.title || "",
          image: (r.mangaId as any)?.image || "",
          genre: (r.mangaId as any)?.genre || ""
        }
      };
    });


    res.json(result);
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
};



export const createReview = async (req: Request, res: Response) => {
  const { comment, rating, mangaId } = req.body;
  const userId = req.user?.id;

  if (!comment || !rating || !mangaId || !userId) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ' });
  }


  try {
    const review = new Reviews({ userId, comment, rating, mangaId });
    await review.save();

    const allUserReviews = await Reviews.find({ userId });

    const user = await User.findById(userId);

    res.status(201).json({
      id: review._id,
      comment: review.comment,
      rating: review.rating,
      mangaId: review.mangaId,
      createdAt: review.createdAt,
      likes: review.likes,
      user: {
        name: user?.username || 'Unknown',
        avatar: user?.profileImage || '',
        tagPerson: getUserReviewTags(allUserReviews) 
      },
    });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: (err as Error).message });
  }
};

export const likeReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const review = await Reviews.findById(id);
  if (!review) return res.status(404).json({ error: 'Review not found' });

  const typedReview = review as IReview;

  const index = typedReview.likedBy.findIndex((uid) => uid.toString() === userId);

  if (index !== -1) {
    typedReview.likedBy.splice(index, 1);
    typedReview.likes -= 1;
  } else {
    typedReview.likedBy.push(userId as any);
    typedReview.likes += 1;
  }

  await typedReview.save();
  res.json({ likes: typedReview.likes, liked: index === -1 });
};


export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Reviews.findByIdAndDelete(id);
    res.status(204).json({
      message: 'Review deleted successfully',
    });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
}
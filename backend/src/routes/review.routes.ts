import express from 'express';
import { createReview, deleteReview, getReviews, likeReview } from '../controllers/review.controller';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/reviews', getReviews);
router.post('/reviews', verifyToken, createReview as any); 
router.patch('/reviews/:id/like', verifyToken, likeReview as any);  
router.delete('/reviews/:id', verifyToken, deleteReview);

export default router;

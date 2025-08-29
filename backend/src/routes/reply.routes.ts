import express from 'express'
import { fetchReplyByComment, replyCreate } from '../controllers/reply.controller';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get("/replys/:id", fetchReplyByComment as any)
router.post("/replys/create", verifyToken, replyCreate)

export default router;
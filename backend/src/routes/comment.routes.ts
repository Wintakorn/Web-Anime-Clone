import express from 'express'
import { createComment, fetchCommentsByPost, updateCommentImage } from '../controllers/comment.controller'
import { verifyToken } from '../middleware/authMiddleware'
import { upload } from '../utils/upload'
const router = express.Router()


router.get('/comments/:id', fetchCommentsByPost as any)
router.post('/comment/create',verifyToken, createComment)
router.put('/comment/image/:id', verifyToken, upload.single('image'), updateCommentImage as any);

export default router;

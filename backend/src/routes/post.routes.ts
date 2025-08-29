import express from 'express';
import { CreatePost, deletePost, fetchPostall, fetchPostById, updatePostById, updatePostImage } from '../controllers/post.controller';
import { verifyToken } from '../middleware/authMiddleware';
import { upload } from '../utils/upload';

const router = express.Router();

router.get('/posts', fetchPostall);
router.get('/post/:id', fetchPostById as any);
router.post('/post/create', verifyToken, CreatePost);
router.delete('/post/delete/:id', verifyToken, deletePost);
router.put('/post/update/:id', verifyToken, updatePostById)
router.put('/post/image/:id', verifyToken, upload.single('image'), updatePostImage as any);

export default router;
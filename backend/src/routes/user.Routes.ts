import express from 'express';
import {
    deleteUser,
    getAllUser,
    getCurrentUser,
    getUserById,
    getUserFavorites,
    loginUser,
    registerUser,
    toggleFavorite,
    updateProfileImage,
    updateUser
} from '../controllers/user.controller';
import { upload } from '../utils/upload';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/users', getAllUser);
router.get('/users/:id', getUserById)
router.post('/user/register', registerUser)
router.post('/user/login', loginUser)
router.put('/user/:id', updateUser)
router.delete('/user/:id', deleteUser)
router.patch('/user/profile-image', verifyToken, upload.single('image'), updateProfileImage as any);
router.get('/user/me', verifyToken, getCurrentUser as any);
router.put('/favorite/:id', verifyToken, toggleFavorite as any);
router.get('/user/favorites', verifyToken, getUserFavorites as any);
export default router;
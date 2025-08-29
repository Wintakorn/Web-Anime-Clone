import express from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { addOrUpdateCart, getCart, removeCartItem, updateCartItemQuantity } from '../controllers/cart.controller';


const router = express.Router();

router.post('/cart', verifyToken, addOrUpdateCart);
router.get('/cart', verifyToken, getCart);
router.delete('/cart/:mangaId', verifyToken, removeCartItem as any);
router.put('/cart/:mangaId', verifyToken, updateCartItemQuantity as any);

export default router;


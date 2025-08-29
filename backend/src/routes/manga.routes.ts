import express from 'express';
import { createManga, deleteManga, getMangaById, getMangas, updateManga } from '../controllers/manga.controller';
import { verifyAdmin, verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/mangas',getMangas)
router.get('/manga/:id', getMangaById);
router.post('/manga/create', verifyToken, verifyAdmin, createManga);
router.put('/manga/update/:id', updateManga)
router.delete('/manga/delete/:id', deleteManga)

export default router;
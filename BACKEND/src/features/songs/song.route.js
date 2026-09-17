import express from 'express';
import multer from 'multer';
import { uploadLocalSong, addSpotifySong, getSongs, getSongsByMood } from './song.controller.js';
import { protectRoute } from '../auth/auth.middleware.js';

const router = express.Router();

// Multer config for memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getSongs);
router.get('/recommendations', getSongsByMood);

router.post('/local', protectRoute, upload.single('file'), uploadLocalSong);
router.post('/spotify', protectRoute, addSpotifySong);

export default router;

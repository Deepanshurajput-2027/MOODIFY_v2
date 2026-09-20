import express from 'express';
import { updateProfile } from './user.controller.js';
import { connectSpotify } from './spotify.controller.js';
import { protectRoute } from '../auth/auth.middleware.js';

const router = express.Router();

router.put('/profile', protectRoute, updateProfile);
router.post('/spotify/connect', protectRoute, connectSpotify);

export default router;

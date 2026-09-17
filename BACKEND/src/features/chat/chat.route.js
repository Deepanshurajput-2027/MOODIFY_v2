import express from 'express';
import { streamChat } from './chat.controller.js';
import { protectRoute } from '../auth/auth.middleware.js';

const router = express.Router();

router.post('/stream', protectRoute, streamChat);

export default router;

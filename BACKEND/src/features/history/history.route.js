import express from 'express';
import { getUserHistory } from './history.controller.js';
import { protectRoute } from '../auth/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getUserHistory);

export default router;

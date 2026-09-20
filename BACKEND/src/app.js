import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './features/auth/auth.route.js';
import songRoutes from './features/songs/song.route.js';
import chatRoutes from './features/chat/chat.route.js';
import historyRoutes from './features/history/history.route.js';
import userRoutes from './features/users/user.route.js';

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/users', userRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Moodify API is running');
});

export default app;

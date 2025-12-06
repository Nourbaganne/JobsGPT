import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import jobsRoutes from './jobs.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/jobs', jobsRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;


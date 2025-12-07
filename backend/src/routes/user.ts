import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/profile', userController.getProfile);

export default router;

import { Router } from 'express';
import * as jobsController from '../controllers/jobsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', jobsController.getAllJobs);
router.get('/top', jobsController.getTopJobs);
router.get('/count', jobsController.getJobCount);
router.get('/:id', jobsController.getJobById);

export default router;

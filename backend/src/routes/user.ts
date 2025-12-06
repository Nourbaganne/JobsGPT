import { Router } from 'express';
import multer from 'multer';
import * as userController from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

// All routes require authentication
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.get('/preferences', userController.getPreferences);
router.put('/preferences', userController.updatePreferences);
router.post('/resume', upload.single('resume'), userController.uploadResume);

export default router;


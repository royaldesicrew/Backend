import express from 'express';
import multer from 'multer';
import {
  getAllPhotos,
  uploadPhoto,
  updatePhoto,
  deletePhoto,
  getPhotoStats
} from '../controllers/photoController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for memory storage (for Vercel compatibility)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.get('/', getAllPhotos);
router.post('/upload', authenticate, upload.single('photo'), uploadPhoto);
router.put('/:id', authenticate, upload.single('photo'), updatePhoto);
router.delete('/:id', authenticate, deletePhoto);
router.get('/stats', authenticate, getPhotoStats);

export default router;

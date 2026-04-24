import express from 'express';
import {
  getDashboardStats,
  getPhotosStats,
  getBlogsStats,
  trackEvent
} from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authenticate, getDashboardStats);
router.get('/photos', authenticate, getPhotosStats);
router.get('/blogs', authenticate, getBlogsStats);
router.post('/track', trackEvent);

export default router;

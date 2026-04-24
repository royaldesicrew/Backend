import express from 'express';
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogStats
} from '../controllers/blogController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllBlogs);
router.post('/', authenticate, createBlog);
router.put('/:id', authenticate, updateBlog);
router.delete('/:id', authenticate, deleteBlog);
router.get('/stats', authenticate, getBlogStats);

export default router;

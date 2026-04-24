import express from 'express';
import {
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  validateDiscount
} from '../controllers/discountController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllDiscounts);
router.post('/', authenticate, createDiscount);
router.put('/:id', authenticate, updateDiscount);
router.delete('/:id', authenticate, deleteDiscount);
router.post('/validate', validateDiscount);

export default router;

import express from 'express';
import { sendBookingEmail } from '../controllers/emailController.js';

const router = express.Router();

// POST /api/emails/send - Send booking/inquiry email
router.post('/send', sendBookingEmail);

export default router;

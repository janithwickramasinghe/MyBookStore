import express from 'express';

import { 
  forgotPassword, 
  resetPassword, 
  login, 
  register, 
  sendVerificationEmail,
  verifyEmail 
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);           // POST /api/auth/register
router.get('/verify-email', verifyEmail);     // GET  /api/auth/verify-email?token=...
router.post('/login', login);                 // POST /api/auth/login
router.post('/forgot-password', forgotPassword); // POST /api/auth/forgot-password
router.post('/reset-password', resetPassword);   // POST /api/auth/reset-password
router.post('/send-verification-email', sendVerificationEmail); // POST /api/auth/send-verification-email


export default router;

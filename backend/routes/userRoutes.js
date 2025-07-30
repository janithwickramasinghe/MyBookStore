import express from 'express';
import { protect } from '../middleware/usermiddleware.js'; // Importing the protect middleware
import { 
  forgotPassword, 
  resetPassword, 
  login, 
  register, 
  sendVerificationEmail,
  completeProfile,
  verifyEmail 
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', register);           // POST /api/auth/register
router.get('/verify-email', verifyEmail);     // GET  /api/auth/verify-email?token=...
router.post('/login', login);                 // POST /api/auth/login
router.post('/forgot-password', forgotPassword); // POST /api/auth/forgot-password
router.post('/reset-password', resetPassword);   // POST /api/auth/reset-password
router.post('/send-verification-email', sendVerificationEmail); // POST /api/auth/send-verification-email
// router.post('/complete-profile', protect, completeProfile); // POST /api/auth/complete-profile (protected route)
router.put('/complete-profile', protect, completeProfile); // now matches PUT from frontend



export default router;

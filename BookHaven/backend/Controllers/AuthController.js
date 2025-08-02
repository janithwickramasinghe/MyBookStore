const { getOtp, deleteOtp } = require('../utils/otpStore');
const { findUserByEmail } = require('./UserController');
const User = require('../Model/UserModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService');
require('dotenv').config();
const bcrypt = require('bcryptjs');

// ---------------------- Email OTP Verification ----------------------
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    const stored = getOtp(email);
    if (!stored) return res.status(400).json({ message: "OTP not found or expired" });

    if (String(otp) !== String(stored.otp)) {
      deleteOtp(email);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > stored.expiresAt) {
      deleteOtp(email);
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.isVerified = true;
    await user.save();

    deleteOtp(email);
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Error in verifyOtp:", err);
    return res.status(500).json({ message: "Internal server error during OTP verification" });
  }
};

// ---------------------- Forgot Password ----------------------
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendEmail(email, 'Reset Your Password', `Click to reset your password: ${resetLink}`);

    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------------- Reset Password ----------------------
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Hash the new password before saving
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
  
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
      console.error("Reset Password Error:", err);
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  };

module.exports = {
  verifyOtp,
  forgotPassword,
  resetPassword
};

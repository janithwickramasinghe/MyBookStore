import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import transporter from '../config/emailConfig.js';
import dotenv from 'dotenv';
// import { EMAIL_VERIFICATION_TEMPLATE } from '../config/emailTemplates.js';

dotenv.config();

function generateToken(payload, expiresIn = '1d') {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user with isVerified = false
    const newUser = new User({ name, email, password: hashedPassword, isVerified: false });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully. Please verify your email separately.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send verification email
const sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    // Create a token with user ID only
    const token = generateToken({ id: user._id }, '1d');

    const verificationLink = `http://localhost:5000/api/auth/verify-email?token=${token}`;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Hi ${user.name}, please <a href="${verificationLink}">click here</a> to verify your email.</p>`
    });

    res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Email verification endpoint
const verifyEmail = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(400).json({ message: 'Token is required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verified! You can now log in.' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};


// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const isValid = await bcrypt.compare(password, user.password);

    const hashedPasswordnew = await bcrypt.hash(password, 10);

    if (!isValid) {
      return res.status(400).json({ message: `Password is incorrect ${password} and ${user.password} and ${hashedPasswordnew}` });
    }

    // Generate JWT
    const token = generateToken({ id: user._id, email: user.email });
    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: "An error occurred during login" });
  }
};


// Forgot Password (request reset)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    // Generate reset token
    const token = generateToken({ id: user._id }, '1h');
    const resetLink = `http://localhost:3000/reset-password?token=${token}`; // frontend route
    // Send reset email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Hi, click <a href="${resetLink}">here</a> to reset your password.</p>`
    });
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};

// Reset Password (using token)
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword; // will be hashed by pre-save
    await user.save();
    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Changed',
      html: `<p>Your password has been changed successfully.</p>`
    });
    res.json({ message: 'Password has been reset' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export {
  forgotPassword,
  resetPassword,
  login,
  register,
  sendVerificationEmail,
  verifyEmail
}

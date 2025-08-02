const User = require("../Model/UserModel");
const crypto = require('crypto');
const { sendVerificationEmail } = require('../services/emailService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { setOtp } = require('../utils/otpStore');
const mongoose = require('mongoose'); // Add this at the top of your file

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
// For sending emails, you will later use nodemailer
// const sendVerificationEmail = require('../services/emailService'); // (to be implemented)

//Data display for all users
const getAllUsers = async (req, res, next) => {

    let users; // Get all users
    try {
        users = await User.find();
    } catch (err) {
        console.log(err);
    }
    // Users not found 
    if (!users) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ users });     //Display All users 
};

// Data Insert
const addUsers = async (req, res) => {
    const { firstName, lastName, phone, email, dob, address, password } = req.body;

    // Basic input validation
    if (!firstName || !lastName || !phone || !email || !dob || !address || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Error checking existing user" });
    }

    // Hash password
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
        return res.status(500).json({ message: "Error hashing password" });
    }

    // Create user (but do not save yet)
    let newUser = new User({
        firstName,
        lastName,
        phone,
        email,
        dob,
        address,
        password: hashedPassword,
        isVerified: false,
        role: 'user',
    });

    // Generate OTP and store it temporarily
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    setOtp(email, otp);

    // Send OTP via email
    try {
        await sendVerificationEmail(email, otp);
    } catch (err) {
        console.error("Email sending error:", err);
        return res.status(500).json({ message: "Error sending verification email. User not registered." });
    }

    // Only save user if email sent successfully
    try {
        await newUser.save();
    } catch (err) {
        return res.status(500).json({ message: "Error saving user" });
    }

    return res.status(201).json({
        message: "User registered. Please verify your email with the OTP sent.",
        user: { email: newUser.email, isVerified: newUser.isVerified }
    });
};

// Get by ID

const getById = async (req, res, next) => {
    const id = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    let user;
    try {
        user = await User.findById(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
};

// Update details
const updateUser = async (req, res, next) => {
    const id = req.params.id;
    const { firstName, lastName, phone, email, dob, address, password } = req.body;

    let users;
    try {
        users = await User.findByIdAndUpdate(id,
            { firstName, lastName, phone, email, dob, address, password });
        users = await users.save();
    } catch (err) {
        console.log(err);
    }
    // not available users
    if (!users) {
        return res.status(404).json({ message: "Unable to Update User Details" });
    }
    return res.status(200).json({ users });
};

// Delete User details
const deleteUser = async (req, res, next) => {

    const id = req.params.id;

    let users;
    try {
        users = await User.findByIdAndDelete(id)
    } catch (err) {
        console.log(err);
    }
    // not available users
    if (!users) {
        return res.status(404).json({ message: "Unable to delete User Details" });
    }
    return res.status(200).json({ users });
};

// Email verification
const verifyEmail = async (req, res, next) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).json({ message: "Verification token is required" });
    }
    let user;
    try {
        user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        return res.status(200).json({ message: "Email verified successfully. You can now log in." });
    } catch (err) {
        return res.status(500).json({ message: "Error verifying email" });
    }
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if verified
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in' });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                firstName: user.firstName,
                role: user.role,
                email: user.email,
            },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error during login' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
        {
            id: user._id,
            firstName: user.firstName,
            role: user.role,
            email: user.email,
        },
        JWT_SECRET,
        { expiresIn: '15m' } // shorter expiration
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // Send accessToken in response, optionally send refreshToken as HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
        message: 'Login successful',
        accessToken,
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
        }
    });

};

const findUserByEmail = async (email) => {
    if (!email) throw new Error("Email is required");
    const user = await User.findOne({ email });
    return user;
};

const loginAdmin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Not an admin.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: 'Admin login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (err) {
        console.error('Admin login error:', err);
        return res.status(500).json({ message: 'Server error during admin login' });
    }
};

const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) return res.status(401).json({ message: 'Missing refresh token' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign(
            {
                id: user._id,
                firstName: user.firstName,
                role: user.role,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        return res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ message: 'Refresh token expired or invalid' });
    }
};




module.exports = {
    getAllUsers,
    addUsers,
    getById,
    updateUser,
    deleteUser,
    verifyEmail,
    loginUser,
    findUserByEmail,
    loginAdmin,
    refreshAccessToken
};
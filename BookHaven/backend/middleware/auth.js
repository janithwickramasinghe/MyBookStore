const jwt = require('jsonwebtoken');
const User = require('../Model/UserModel');

// Replace with your actual secret key (move this to .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach only essential user info to req.user
        req.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { authenticateUser };

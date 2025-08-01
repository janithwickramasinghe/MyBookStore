const { getOtp, deleteOtp } = require('../utils/otpStore');
const { findUserByEmail } = require('./UserController');

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    console.log(`Verifying OTP for email: ${email}, OTP: ${otp}`);
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        const stored = getOtp(email);
        if (!stored) {
            return res.status(400).json({ message: "OTP not found or expired" });
        }

        // Ensure both are strings for comparison
        const inputOtp = String(otp);
        const storedOtp = String(stored.otp);

        if (inputOtp !== storedOtp) {
            deleteOtp(email); // Invalidate OTP on wrong attempt
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

module.exports = { verifyOtp };
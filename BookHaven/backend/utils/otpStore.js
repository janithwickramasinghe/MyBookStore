// utils/otpStore.js
const otpMap = new Map();

const setOtp = (email, otp) => {
    otpMap.set(email, { otp, expiresAt: Date.now() + 30 * 60 * 1000 }); // 30 mins

    // Auto-delete after 30 mins
    setTimeout(() => {
        otpMap.delete(email);
    }, 30 * 60 * 1000);
};

const getOtp = (email) => {
    return otpMap.get(email);
};

const deleteOtp = (email) => {
    otpMap.delete(email);
};

module.exports = { setOtp, getOtp, deleteOtp };

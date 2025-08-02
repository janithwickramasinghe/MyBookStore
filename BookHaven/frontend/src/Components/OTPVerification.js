import React, { useState } from 'react';
import axios from '../api/axios';
import { useLocation } from 'react-router-dom';
import {
  HiShieldCheck,
  HiMail,
  HiKey,
  HiCheckCircle,
  HiExclamationCircle,
  HiX,
  HiArrowLeft,
  HiClock
} from 'react-icons/hi';

const OTPVerification = () => {
  // For demo purposes, simulating location state
  const location = useLocation();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
  
    try {
      const res = await axios.post('/users/verify-otp', {
        email,
        otp
      });
  
      setMessage(res.data.message);
      setTimeout(() => {
        window.location.href = '/'; // Redirect to login
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || 'OTP verification failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleResendOTP = async () => {
    try {
      setMessage('');
      setError('');
      await axios.post('/users/resend-otp', { email });
      setMessage('OTP has been resent to your email');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
      <div className="w-full max-w-md">
        {/* Main Verification Card */}
        <div className="overflow-hidden bg-white rounded-2xl border shadow-lg border-neutral-100">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r border-b from-primary-50 to-secondary-50 border-neutral-100">
            <div className="text-center">
              <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-gradient-to-br rounded-full from-primary-200 to-primary-300">
                <HiShieldCheck className="w-8 h-8 text-primary-700" />
              </div>
              <h1 className="text-2xl font-gilroyHeavy text-neutral-900">
                OTP Verification
              </h1>
              <p className="mt-2 text-sm text-neutral-600 font-gilroyRegular">
                Secure your account with verification
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Email Display */}
            <div className="p-4 mb-6 rounded-xl border bg-neutral-50 border-neutral-200">
              <div className="flex items-center space-x-3">
                <HiMail className="flex-shrink-0 w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm font-gilroyMedium text-neutral-700">
                    Verification code sent to:
                  </p>
                  <p className="font-gilroyBold text-neutral-900">
                    {email || 'your@email.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Success/Error Messages */}
            {message && (
              <div className="flex items-center p-4 mb-4 space-x-3 bg-green-50 rounded-xl border border-green-200">
                <HiCheckCircle className="flex-shrink-0 w-5 h-5 text-green-600" />
                <span className="text-green-800 font-gilroyMedium">{message}</span>
                <button
                  onClick={() => setMessage('')}
                  className="ml-auto text-green-600 hover:text-green-700"
                >
                  <HiX className="w-4 h-4" />
                </button>
              </div>
            )}

            {error && (
              <div className="flex items-center p-4 mb-4 space-x-3 bg-red-50 rounded-xl border border-red-200">
                <HiExclamationCircle className="flex-shrink-0 w-5 h-5 text-red-600" />
                <span className="text-red-800 font-gilroyMedium">{error}</span>
                <button
                  onClick={() => setError('')}
                  className="ml-auto text-red-600 hover:text-red-700"
                >
                  <HiX className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* OTP Form */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                  <HiKey className="w-4 h-4 text-primary-600" />
                  <span>Enter Verification Code</span>
                </label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="px-4 py-3 w-full text-lg tracking-widest text-center bg-white rounded-xl border transition-colors font-gilroyBold border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-neutral-500 font-gilroyRegular">
                  Please enter the 6-digit code sent to your email
                </p>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !otp || otp.length < 6}
                className="flex justify-center items-center py-3 space-x-2 w-full text-white rounded-xl transition-all duration-200 bg-primary-600 font-gilroyBold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-b-2 border-white animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <HiShieldCheck className="w-5 h-5" />
                    <span>Verify OTP</span>
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="mb-3 text-sm text-neutral-600 font-gilroyRegular">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendOTP}
                  className="flex items-center px-4 py-2 mx-auto space-x-2 rounded-lg border transition-colors text-primary-600 bg-primary-50 border-primary-200 font-gilroyMedium hover:bg-primary-100"
                >
                  <HiClock className="w-4 h-4" />
                  <span>Resend OTP</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center px-4 py-2 mx-auto space-x-2 bg-white rounded-lg border transition-colors text-neutral-600 border-neutral-200 font-gilroyMedium hover:bg-neutral-50"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Info Card */}
        <div className="p-4 mt-6 bg-white rounded-2xl border shadow-lg border-neutral-100">
          <div className="flex items-start space-x-3">
            <HiExclamationCircle className="flex-shrink-0 mt-1 w-5 h-5 text-primary-600" />
            <div>
              <h3 className="font-gilroyBold text-neutral-900">Security Tips</h3>
              <ul className="mt-2 space-y-1 text-sm text-neutral-600 font-gilroyRegular">
                <li>• Check your email inbox and spam folder</li>
                <li>• The OTP is valid for 10 minutes</li>
                <li>• Don't share your OTP with anyone</li>
                <li>• Contact support if you continue having issues</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
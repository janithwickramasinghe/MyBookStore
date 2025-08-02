import React, { useState } from 'react';
import axios from '../../api/axios';
import {
  HiLockClosed,
  HiMail,
  HiCheckCircle,
  HiExclamationCircle,
  HiX,
  HiArrowLeft,
  HiPaperAirplane
} from 'react-icons/hi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      await axios.post('users/forgot-password', { email });
      setMessage('Reset link sent to your email. Please check your inbox.');
      setEmail(''); // Clear the email field on success
    } catch (err) {
      setError(
        err.response?.data?.message || 'Error sending reset link. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30">
      <div className="w-full max-w-md">
        {/* Main Reset Password Card */}
        <div className="overflow-hidden bg-white rounded-2xl border shadow-lg border-neutral-100">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r border-b from-primary-50 to-secondary-50 border-neutral-100">
            <div className="text-center">
              <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-gradient-to-br rounded-full from-primary-200 to-primary-300">
                <HiLockClosed className="w-8 h-8 text-primary-700" />
              </div>
              <h1 className="text-2xl font-gilroyHeavy text-neutral-900">
                Forgot Password
              </h1>
              <p className="mt-2 text-sm text-neutral-600 font-gilroyRegular">
                Reset your password securely
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Instructions */}
            <div className="p-4 mb-6 rounded-xl border bg-neutral-50 border-neutral-200">
              <div className="flex items-start space-x-3">
                <HiExclamationCircle className="flex-shrink-0 mt-1 w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm font-gilroyMedium text-neutral-700">
                    Enter your email address and we'll send you a link to reset your password.
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

            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                  <HiMail className="w-4 h-4 text-primary-600" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="px-4 py-3 w-full bg-white rounded-xl border transition-colors font-gilroyRegular border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-neutral-500 font-gilroyRegular">
                  We'll send a password reset link to this email
                </p>
              </div>

              {/* Send Reset Link Button */}
              <button
                type="submit"
                disabled={loading || !email}
                className="flex justify-center items-center py-3 space-x-2 w-full text-white rounded-xl transition-all duration-200 bg-primary-600 font-gilroyBold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-b-2 border-white animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <HiPaperAirplane className="w-5 h-5" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center px-4 py-2 mx-auto space-x-2 bg-white rounded-lg border transition-colors text-neutral-600 border-neutral-200 font-gilroyMedium hover:bg-neutral-50"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>
        </div>

        {/* Info Card */}
        <div className="p-4 mt-6 bg-white rounded-2xl border shadow-lg border-neutral-100">
          <div className="flex items-start space-x-3">
            <HiExclamationCircle className="flex-shrink-0 mt-1 w-5 h-5 text-primary-600" />
            <div>
              <h3 className="font-gilroyBold text-neutral-900">Reset Instructions</h3>
              <ul className="mt-2 space-y-1 text-sm text-neutral-600 font-gilroyRegular">
                <li>• Check your email inbox and spam folder</li>
                <li>• The reset link expires in 1 hour</li>
                <li>• You can request a new link if needed</li>
                <li>• Contact support if you don't receive the email</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
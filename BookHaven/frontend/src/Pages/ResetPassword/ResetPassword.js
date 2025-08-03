import React, { useState } from 'react';
import axios from '../../api/axios';
import { useParams } from 'react-router-dom';
import {
  HiLockClosed,
  HiKey,
  HiEye,
  HiEyeOff,
  HiCheckCircle,
  HiExclamationCircle,
  HiX,
  HiArrowLeft,
  HiShieldCheck
} from 'react-icons/hi';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (!passwordValidation.isValid) {
      setError('Please ensure your password meets all requirements.');
      return;
    }
    
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      await axios.post(`users/reset-password/${token}`, { newPassword });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        // navigate('/login'); // Would use navigate in real implementation
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to reset password. Please try again or request a new reset link.'
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
                Reset Password
              </h1>
              <p className="mt-2 text-sm text-neutral-600 font-gilroyRegular">
                Create a new secure password
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
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
            <form onSubmit={handleReset} className="space-y-6">
              {/* New Password */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                  <HiKey className="w-4 h-4 text-primary-600" />
                  <span>New Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="px-4 py-3 pr-12 w-full bg-white rounded-xl border transition-colors font-gilroyRegular border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-gilroyMedium text-neutral-700">
                  <HiKey className="w-4 h-4 text-primary-600" />
                  <span>Confirm Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="px-4 py-3 pr-12 w-full bg-white rounded-xl border transition-colors font-gilroyRegular border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    {showConfirmPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-500 font-gilroyRegular">
                    Passwords do not match
                  </p>
                )}
                {confirmPassword && passwordsMatch && (
                  <p className="text-xs text-green-500 font-gilroyRegular">
                    Passwords match
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              {newPassword && (
                <div className="p-4 rounded-xl border bg-neutral-50 border-neutral-200">
                  <h4 className="mb-2 text-sm font-gilroyMedium text-neutral-700">
                    Password Requirements:
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className={`flex items-center space-x-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-red-500'}`}>
                      <HiCheckCircle className="w-3 h-3" />
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-500'}`}>
                      <HiCheckCircle className="w-3 h-3" />
                      <span>One uppercase letter</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-red-500'}`}>
                      <HiCheckCircle className="w-3 h-3" />
                      <span>One lowercase letter</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-red-500'}`}>
                      <HiCheckCircle className="w-3 h-3" />
                      <span>One number</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-500'}`}>
                      <HiCheckCircle className="w-3 h-3" />
                      <span>One special character</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Reset Password Button */}
              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword || !passwordValidation.isValid || !passwordsMatch}
                className="flex justify-center items-center py-3 space-x-2 w-full text-white rounded-xl transition-all duration-200 bg-primary-600 font-gilroyBold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-b-2 border-white animate-spin"></div>
                    <span>Resetting...</span>
                  </>
                ) : (
                  <>
                    <HiShieldCheck className="w-5 h-5" />
                    <span>Reset Password</span>
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
              <h3 className="font-gilroyBold text-neutral-900">Security Tips</h3>
              <ul className="mt-2 space-y-1 text-sm text-neutral-600 font-gilroyRegular">
                <li>• Use a strong, unique password</li>
                <li>• Don't reuse passwords from other accounts</li>
                <li>• Consider using a password manager</li>
                <li>• Keep your password secure and private</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
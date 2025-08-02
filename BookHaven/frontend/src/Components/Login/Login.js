import React, { useState } from 'react';
import axios from '../../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/users/login', { email, password });

      if (response.data && response.data.token) {
        const { token, user } = response.data;

        setMessage('Login successful!');
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);

        setTimeout(() => {
          if (user.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/home');
          }
        }, 1000);
      } else {
        setMessage('Unexpected response from server.');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred during login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4 min-h-screen bg-gradient-to-br via-white from-primary-50 to-secondary-50 animate-fade-in">
      {/* Background Pattern */}
      <div className="overflow-hidden absolute inset-0">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full opacity-30 blur-3xl animate-pulse bg-primary-100"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full opacity-30 blur-3xl delay-1000 animate-pulse bg-secondary-100"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="p-8 rounded-3xl border shadow-2xl backdrop-blur-lg bg-white/80 border-white/20 animate-pop-in">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex justify-center items-center mb-4 w-16 h-16 bg-gradient-to-r rounded-2xl shadow-lg transition-transform duration-300 transform from-primary-500 to-secondary-500 hover:scale-110">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="mb-2 text-3xl font-gilroyHeavy text-neutral-900">Welcome Back</h1>
            <p className="text-neutral-600 font-gilroyRegular">Sign in to your BookHaven account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="relative group">
              <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 pl-12 w-full rounded-xl border transition-all duration-300 bg-neutral-50 border-neutral-200 font-gilroyRegular text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent group-hover:border-primary-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <svg className="absolute left-4 top-1/2 w-5 h-5 transition-colors transform -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="px-4 py-3 pr-12 pl-12 w-full rounded-xl border transition-all duration-300 bg-neutral-50 border-neutral-200 font-gilroyRegular text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent group-hover:border-primary-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <svg className="absolute left-4 top-1/2 w-5 h-5 transition-colors transform -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transition-colors transform -translate-y-1/2 text-neutral-400 hover:text-primary-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 rounded text-primary-600 bg-neutral-100 border-neutral-300 focus:ring-primary-500 focus:ring-2" />
                <span className="ml-2 text-sm font-gilroyRegular text-neutral-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm transition-colors font-gilroyRegular text-primary-600 hover:text-primary-700">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-gilroyBold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <svg className="mr-3 -ml-1 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl font-gilroyRegular text-center animate-fade-in ${
              message.includes('successful') 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-neutral-600 font-gilroyRegular">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="transition-colors font-gilroyBold text-primary-600 hover:text-primary-700"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
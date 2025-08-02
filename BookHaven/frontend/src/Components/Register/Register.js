import React, { useState } from 'react';
import axios from '../../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dob: '',
    address: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await axios.post('/users', form);
      setMessage(res.data.message);
      setTimeout(() => {
        navigate('/verify-otp', { state: { email: form.email } });
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleBlur = (e) => {
    validateField(e.target.name);
  }

  const validateStep = (stepToValidate = step) => {
    const newErrors = {};

    if (stepToValidate === 1) {
      if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!form.dob) newErrors.dob = 'Date of birth is required';
    }

    if (stepToValidate === 2) {
      if (!form.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';

      if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^\d{10}$/.test(form.phone)) newErrors.phone = 'Phone number must be 10 digits';

      if (!form.address.trim()) newErrors.address = 'Address is required';
    }

    if (stepToValidate === 3) {
      if (!form.password.trim()) newErrors.password = 'Password is required';
      else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      else if (!/[A-Z]/.test(form.password)) newErrors.password = 'Include at least one uppercase letter';
      else if (!/[0-9]/.test(form.password)) newErrors.password = 'Include at least one number';
      else if (!/[^A-Za-z0-9]/.test(form.password)) newErrors.password = 'Include at least one special character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-2xl font-gilroyBold text-neutral-900">Personal Information</h2>
              <p className="text-sm text-neutral-600 font-gilroyRegular">Let's start with your basic details</p>
            </div>

            {/* First Name */}
            <div className="relative group">
              <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">First Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 pl-12 w-full rounded-xl border transition-all duration-300 bg-neutral-50 border-neutral-200 font-gilroyRegular text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent group-hover:border-primary-300"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500 font-gilroyRegular">{errors.firstName}</p>
                )}
                <svg className="absolute left-4 top-1/2 w-5 h-5 transition-colors transform -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Last Name */}
            <div className="relative group">
              <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">Last Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 pl-12 w-full rounded-xl border transition-all duration-300 bg-neutral-50 border-neutral-200 font-gilroyRegular text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent group-hover:border-primary-300"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500 font-gilroyRegular">{errors.lastName}</p>
                )}
                <svg className="absolute left-4 top-1/2 w-5 h-5 transition-colors transform -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="relative group">
              <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">Date of Birth</label>
              <div className="relative">
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 pl-12 w-full rounded-xl border transition-all duration-300 bg-neutral-50 border-neutral-200 font-gilroyRegular text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent group-hover:border-primary-300"
                />
                {errors.dob && (
                  <p className="mt-1 text-sm text-red-500 font-gilroyRegular">{errors.dob}</p>
                )}
                <svg className="absolute left-4 top-1/2 w-5 h-5 transition-colors transform -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <button
              type="button"
              onClick={nextStep}
              disabled={!form.firstName || !form.lastName || !form.dob}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-gilroyBold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Continue
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-2xl font-gilroyBold text-neutral-900">Contact Details</h2>
              <p className="text-sm text-neutral-600 font-gilroyRegular">How can we reach you?</p>
            </div>

            {/* Email */}
            <div className="relative group">
              <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 pl-12 w-full rounded-xl border transition-all duration-300 bg-neutral-50 border-neutral-200 font-gilroyRegular text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent group-hover:border-primary-300"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 font-gilroyRegular">{errors.email}</p>
                )}
                <svg className="absolute left-4 top-1/2 w-5 h-5 transition-colors transform -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            {/* Phone */}
            <div className="relative group">
              <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 pl-12 w-full rounded-xl border transition-all duration-300 bg-neutral-50 border-neutral-200 font-gilroyRegular text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent group-hover:border-primary-300"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500 font-gilroyRegular">{errors.phone}</p>
                )}
                <svg className="absolute left-4 top-1/2 w-5 h-5 transition-colors transform -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>

            {/* Address */}
            <div className="relative group">
              <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">Address</label>
              <div className="relative">
                <textarea
                  name="address"
                  placeholder="Enter your full address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="px-4 py-3 pl-12 w-full rounded-xl border transition-all duration-300 resize-none bg-neutral-50 border-neutral-200 font-gilroyRegular text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent group-hover:border-primary-300"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500 font-gilroyRegular">{errors.address}</p>
                )}
                <svg className="absolute top-4 left-4 w-5 h-5 transition-colors text-neutral-400 group-focus-within:text-primary-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 px-4 py-3 rounded-xl transition-colors duration-300 bg-neutral-200 text-neutral-700 font-gilroyBold hover:bg-neutral-300"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!form.email || !form.phone || !form.address}
                className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-gilroyBold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-2xl font-gilroyBold text-neutral-900">Account Security</h2>
              <p className="text-sm text-neutral-600 font-gilroyRegular">Create a secure password for your account</p>
            </div>

            {/* Password */}
            <div className="relative group">
              <label className="block mb-2 text-sm font-gilroyBold text-neutral-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 pr-12 pl-12 w-full rounded-xl border transition-all duration-300 bg-neutral-50 border-neutral-200 font-gilroyRegular text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent group-hover:border-primary-300"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500 font-gilroyRegular">{errors.password}</p>
                )}
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
              {/* Password Strength Indicator */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex space-x-1">
                    <div className={`h-2 flex-1 rounded ${form.password.length >= 8 ? 'bg-green-400' : 'bg-neutral-200'}`}></div>
                    <div className={`h-2 flex-1 rounded ${/[A-Z]/.test(form.password) ? 'bg-green-400' : 'bg-neutral-200'}`}></div>
                    <div className={`h-2 flex-1 rounded ${/[0-9]/.test(form.password) ? 'bg-green-400' : 'bg-neutral-200'}`}></div>
                    <div className={`h-2 flex-1 rounded ${/[^A-Za-z0-9]/.test(form.password) ? 'bg-green-400' : 'bg-neutral-200'}`}></div>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500 font-gilroyRegular">
                    Password should include: 8+ characters, uppercase, number, special character
                  </p>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-0.5 w-5 h-5 rounded text-primary-600 bg-neutral-100 border-neutral-300 focus:ring-primary-500 focus:ring-2"
              />
              <label htmlFor="terms" className="text-sm font-gilroyRegular text-neutral-600">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-gilroyBold">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-gilroyBold">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 px-4 py-3 rounded-xl transition-colors duration-300 bg-neutral-200 text-neutral-700 font-gilroyBold hover:bg-neutral-300"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || !form.password}
                className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-gilroyBold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    <svg className="mr-3 -ml-1 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center p-4 min-h-screen bg-gradient-to-br via-white from-primary-50 to-secondary-50 animate-fade-in">
      {/* Background Pattern */}
      <div className="overflow-hidden absolute inset-0">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full opacity-30 blur-3xl animate-pulse bg-primary-100"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 rounded-full opacity-30 blur-3xl delay-1000 animate-pulse bg-secondary-100"></div>
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-md">
        <div className="p-8 rounded-3xl border shadow-2xl backdrop-blur-lg bg-white/80 border-white/20 animate-pop-in">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex justify-center items-center mb-4 w-16 h-16 bg-gradient-to-r rounded-2xl shadow-lg transition-transform duration-300 transform from-primary-500 to-secondary-500 hover:scale-110">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="mb-2 text-3xl font-gilroyHeavy text-neutral-900">Join BookHaven</h1>
            <p className="text-neutral-600 font-gilroyRegular">Create your account to start reading</p>

            {/* Progress Indicator */}
            <div className="mt-6">
              <div className="flex justify-center items-center space-x-2">
                {[1, 2, 3].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={`flex items-center ${stepNumber < 3 ? 'flex-1' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-gilroyBold transition-colors duration-300 ${step >= stepNumber
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-200 text-neutral-500'
                        }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded transition-colors duration-300 ${step > stepNumber ? 'bg-primary-500' : 'bg-neutral-200'
                          }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {renderFormStep()}
          </form>

          {/* Messages */}
          {message && (
            <div className="p-4 mt-6 text-center text-green-800 bg-green-100 rounded-xl border border-green-200 font-gilroyRegular animate-fade-in">
              {message}
            </div>
          )}
          {error && (
            <div className="p-4 mt-6 text-center text-red-800 bg-red-100 rounded-xl border border-red-200 font-gilroyRegular animate-fade-in">
              {error}
            </div>
          )}

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-neutral-600 font-gilroyRegular">
              Already have an account?{' '}
              <Link
                to="/login"
                className="transition-colors font-gilroyBold text-primary-600 hover:text-primary-700"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
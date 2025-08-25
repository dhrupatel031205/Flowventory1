import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiPackage, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: 'admin@flowenventory.com',
    password: 'admin123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(formData.email, formData.password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFocus = (field: 'email' | 'password') => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: 'email' | 'password') => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-green-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl shadow-soft-hover mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Flowventory</h1>
          <p className="text-blue-100 dark:text-gray-300">
            Smart Inventory Management
          </p>
        </div>

        {/* Login card */}
        <div className="card-base p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className={`
                  absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200
                  ${isFocused.email ? 'text-blue-500' : 'text-gray-400'}
                `}>
                  <FiMail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  placeholder="Enter your email"
                  required
                  className="input-base !pl-12 pr-4 py-3 w-full"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className={`
                  absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200
                  ${isFocused.password ? 'text-blue-500' : 'text-gray-400'}
                `}>
                  <FiLock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                  placeholder="Enter your password"
                  required
                  className="input-base !pl-12 !pr-12 py-3 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loading-spinner w-5 h-5 border-2 border-white border-t-transparent"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Demo Credentials
              </p>
              <div className="space-y-2">
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Admin:</span> admin@flowenventory.com / admin123
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Staff:</span> staff@flowenventory.com / staff123
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=''>
          Omesh Desai  (S1036938@)
        </div>

        {/* Footer */}
        <div className="text-center mt-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm text-blue-100 dark:text-gray-400">
            © 2025 Flowventory. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

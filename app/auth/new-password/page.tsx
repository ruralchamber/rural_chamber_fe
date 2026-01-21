// app/auth/new-password/page.tsx
'use client';

import React, { useState } from 'react';
import AuthLayout from '@/components/common/AuthLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AUTH_API } from '@/app/api/endpoints/rest-api/auth/auth';
import { toast } from 'sonner';

const NewPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!strongPasswordRegex.test(formData.password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const email = localStorage.getItem('resetEmail') || '';
      const otp = localStorage.getItem('verifiedOtp') || '';

      const response = await AUTH_API.UPDATE_PASSWORD({
        email,
        otp,
        newPassword: formData.password
      });

      if (response.error === false) {
        toast.success('Password updated successfully');
        
        // Clear reset data from localStorage
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('verifiedOtp');
        
        // Redirect to login page
        setTimeout(() => {
          router.push('/auth/login');
        }, 1500);
      } else {
        setError(response.message || 'Failed to update password');
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      setError(error.response?.data?.message || 'An error occurred while updating password');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const hasConfirmPassword = formData.confirmPassword.length > 0;

  return (
    <AuthLayout
      rightImage="/forgot.png"
      rightTitle="Growth isn't a solo journey."
    >
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Create new password
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Your new password must be different from previous used passwords.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent text-sm pr-12 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={loading}
              className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent text-sm pr-12 disabled:opacity-50 ${
                hasConfirmPassword 
                  ? passwordsMatch 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Password match indicator */}
          {hasConfirmPassword && (
            <div className={`text-sm font-medium ${
              passwordsMatch ? 'text-green-600' : 'text-red-600'
            }`}>
              {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
            </div>
          )}

          {/* Password requirements */}
          <div className="text-xs text-gray-600 space-y-1">
            <div className={`${formData.password.length >= 8 ? 'text-green-600' : 'text-red-600'}`}>
              • At least 8 characters
            </div>
            <div className={`${/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`}>
              • Uppercase and lowercase letters
            </div>
            <div className={`${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`}>
              • At least one number
            </div>
            <div className={`${/(?=.*[@$!%*?&])/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`}>
              • At least one special character
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9FC93B] hover:bg-[#89B534] text-white font-medium py-3 rounded-md transition-colors duration-200 text-sm disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? 'Updating Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-6">
          <Link 
            href="/auth/login"
            className="text-[#9FC93B] hover:text-[#89B534] font-medium underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default NewPasswordPage;
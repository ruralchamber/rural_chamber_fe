// app/auth/forgot-password/page.tsx
'use client';

import React, { useState } from 'react';
import AuthLayout from '@/components/common/AuthLayout';
import Link from 'next/link';
import { AUTH_API } from '@/app/api/endpoints/rest-api/auth/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AUTH_API.SEND_OTP({ email });
      
      // Check for error: false instead of response.success
      if (response.error === false) {
        // Store email in localStorage for the reset-code page
        localStorage.setItem('resetEmail', email);
        
        toast.success('Reset instructions sent to your email');
        
        // Redirect to reset-code page after a short delay
        setTimeout(() => {
          router.push('/auth/reset-code');
        }, 1000);
        
      } else {
        toast.error(response.message || 'Failed to send reset instructions');
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      rightImage="/forgot.png"
      rightTitle="Growth isn't a solo journey."
    >
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Forgot password?
        </h1>
        
        <p className="text-gray-500 text-sm mb-8">
          We will send you reset instructions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent text-sm disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9FC93B] hover:bg-[#89B534] text-white font-medium py-3 rounded-md transition-colors duration-200 text-sm disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? 'Sending...' : 'Reset Password'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-6">
          Have an account?{' '}
          <Link 
            href="/auth/login"
            className="text-[#9FC93B] hover:text-[#89B534] font-medium underline"
          >
            Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
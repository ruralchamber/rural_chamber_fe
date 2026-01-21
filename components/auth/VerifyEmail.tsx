'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/common/AuthLayout';
import { REGISTRATION_API } from '@/app/api/endpoints/rest-api/registration/registration';
import { toast } from 'sonner';

const VerifyEmailPage: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Invalid verification link');
        setIsVerifying(false);
        return;
      }

      try {
        const response = await REGISTRATION_API.VERIFY_EMAIL(token);
        
        if (response.error) {
          throw new Error(response.message || 'Verification failed');
        }

        setIsVerified(true);
        toast.success('Email verified successfully!');
        
        
        if (response.data.user) {
          localStorage.setItem('user_data', JSON.stringify(response.data.user));
          localStorage.setItem('email_verified', 'true');
          localStorage.setItem('continue_registration', 'true');
        }
        
        
        setTimeout(() => {
          router.push('/auth/signup?verified=true');
        }, 2000);
        
      } catch (error: any) {
        setError(error.message || 'Failed to verify email');
        toast.error('Email verification failed');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <AuthLayout 
      rightImage="/signup.png" 
      rightTitle="Where Growth Begins."
    >
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
          {isVerifying ? (
            <span className="text-2xl">⏳</span>
          ) : isVerified ? (
            <span className="text-2xl">✅</span>
          ) : (
            <span className="text-2xl">❌</span>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isVerifying ? 'Verifying Your Email' : isVerified ? 'Email Verified!' : 'Verification Failed'}
        </h2>
        
        {isVerifying && (
          <>
            <p className="text-gray-500 text-sm mb-6">
              Please wait while we verify your email address...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9FC93B] mx-auto"></div>
          </>
        )}

        {isVerified && (
          <>
            <p className="text-gray-500 text-sm mb-6">
              Your email has been successfully verified! Redirecting you to continue registration...
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                ✅ You can now continue with your registration process.
              </p>
            </div>
          </>
        )}

        {error && (
          <>
            <p className="text-gray-500 text-sm mb-6">
              {error}
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">
                ❌ There was a problem verifying your email address.
              </p>
            </div>
            <button
              onClick={() => router.push('/auth/signup')}
              className="w-full bg-[#9FC93B] hover:bg-[#89B534] text-white font-medium py-3 rounded-md transition-colors duration-200 text-sm"
            >
              Go Back to Registration
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { REGISTRATION_API } from '@/app/api/endpoints/rest-api/registration/registration';

interface EmailVerificationStepProps {
  email: string;
  onVerified: () => void;
  onResendEmail: (email: string) => void;
}

export const EmailVerificationStep = ({
  email,
  onVerified,
  onResendEmail,
}: EmailVerificationStepProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const checkVerificationStatus = async (): Promise<boolean> => {
    try {
      const response = await REGISTRATION_API.CHECK_VERIFICATION_STATUS(email);
      
      if (response.error) {
        throw new Error(response.message || 'Failed to check verification status');
      }

      const { emailVerified, user } = response.data;
      
      if (user) {
        localStorage.setItem('user_data', JSON.stringify(user));
      }
      
      return emailVerified;
    } catch (error: any) {
      throw error;
    }
  };

  const handleManualVerificationCheck = async () => {
    setIsChecking(true);
    try {
      const verified = await checkVerificationStatus();
      
      if (verified) {
        toast.success('Email verified successfully!');
        onVerified();
      } else {
        toast.error('Email not verified yet. Please check your email and click the verification link.');
      }
    } catch (error: any) {
      let errorMessage = error.message || 'Failed to check verification status. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsChecking(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    setCountdown(30);
    try {
      await onResendEmail(email);
    } catch (error: any) {
      let errorMessage = error.message || 'Failed to resend verification email. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
        <span className="text-2xl">✉️</span>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email Address</h2>
      <p className="text-gray-500 text-sm mb-6">
        We've sent a verification link to{' '}
        <span className="font-semibold text-gray-900">{email}</span>
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          📧 Click the verification link in your email to continue with your registration. 
          The email might take a few minutes to arrive and could be in your spam folder.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleManualVerificationCheck}
          disabled={isChecking}
          className="w-full bg-[#9FC93B] hover:bg-[#89B534] text-white font-medium py-3 rounded-md transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isChecking ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Checking Verification...
            </>
          ) : (
            'Check Verification Status'
          )}
        </button>

        <button
          onClick={handleResendEmail}
          disabled={isResending || countdown > 0}
          className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-md transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending ? 'Sending...' : countdown > 0 ? `Resend available in ${countdown}s` : 'Resend Verification Email'}
        </button>
      </div>

      <div className="mt-6 text-xs text-gray-500">
        <p>💡 After clicking the verification link in your email, come back here and click "Check Verification Status" to continue.</p>
      </div>
    </div>
  );
};
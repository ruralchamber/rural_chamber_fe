'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PAYMENT_API } from '@/app/api/endpoints/rest-api/payment/payment';
import Link from 'next/link';

type Status = 'verifying' | 'success' | 'failed';

export default function RegistrationSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('reference');
  const [countdown, setCountdown] = useState(30);

  const [status, setStatus] = useState<Status>('verifying');

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      return;
    }

    const verify = async () => {
      try {
        const res = await PAYMENT_API.VERIFY_PAYMENT(reference);

        if (res.data?.status === 'success') {
          setStatus('success');
          toast.success('Payment verified successfully 🎉');
        } else {
          setStatus('failed');
          toast.error('Payment verification failed');
        }
      } catch (error) {
        console.error(error);
        setStatus('failed');
        toast.error('Unable to verify payment');
      }
    };

    verify();
  }, [reference]);

 useEffect(() => {
  if (countdown === 0 && status === 'success') {
    
    const logoutFromBackend = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout/${accessToken}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      } catch (error) {
        console.error('Error logging out from backend:', error);
      }
    };

    localStorage.removeItem('user_data');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('continue_registration');
    localStorage.removeItem('email_verified');
    localStorage.removeItem('payment_reference');
    localStorage.removeItem('payment_registration_id');
    localStorage.removeItem('registration_in_progress');
    localStorage.removeItem('registration_data');
    localStorage.removeItem('current_registration_step');
    
    logoutFromBackend();

    router.push('/auth/login');
  }
}, [countdown, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#f6fbe9] via-white to-[#eef5d6] px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">

        <div className="flex justify-center mb-6">
          {status === 'verifying' && (
            <Loader2 className="w-14 h-14 text-[#9FC93B] animate-spin" />
          )}

          {status === 'success' && (
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle2 className="w-14 h-14 text-green-600" />
            </div>
          )}

          {status === 'failed' && (
            <div className="bg-red-100 rounded-full p-4">
              <XCircle className="w-14 h-14 text-red-600" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {status === 'verifying' && 'Verifying Payment...'}
          {status === 'success' && 'Registration Successful 🎉'}
          {status === 'failed' && 'Payment Verification Failed'}
        </h1>

        <p className="text-gray-600 mb-4">
          {status === 'verifying' &&
            'Please wait while we confirm your payment.'}

          {status === 'success' && (
            <>
              Your membership is now active. Welcome to the Rural Chamber of Commerce.
              <br />
              <span className="font-semibold text-[#9FC93B]">
                Redirecting to login in {countdown} seconds...
              </span>
            </>
          )}

          {status === 'failed' &&
            'We could not confirm your payment. Please contact support or try again.'}
        </p>

        {status === 'success' && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(countdown / 30) * 100}%` }}
            ></div>
          </div>
        )}

        {status === 'failed' && (
          <Link
            href="/"
            className="block w-full rounded-md bg-red-600 py-3 text-sm font-medium text-white hover:bg-red-700"
          >
            Retry Registration
          </Link>
        )}

        {status === 'success' && (
          <button
            onClick={() => {
              localStorage.removeItem('user_data');
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('continue_registration');
              localStorage.removeItem('email_verified');
              localStorage.removeItem('payment_reference');
              localStorage.removeItem('payment_registration_id');
              localStorage.removeItem('registration_in_progress');
              localStorage.removeItem('registration_data');
              localStorage.removeItem('current_registration_step');
              router.push('/auth/login');
            }}
            className="mt-4 text-sm text-[#9FC93B] hover:text-[#8ab52e] underline"
          >
            Go to login now
          </button>
        )}

        <p className="text-xs text-gray-500 mt-6">
          Need help? support@ruralchamber.co.za
        </p>
      </div>
    </div>
  );
}
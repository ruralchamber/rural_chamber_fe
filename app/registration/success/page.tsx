'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PAYMENT_API } from '@/app/api/endpoints/rest-api/payment/payment';

type Status = 'verifying' | 'success' | 'failed';

export default function RegistrationSuccessPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

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

          localStorage.removeItem('user_data');
          localStorage.removeItem('continue_registration');
          localStorage.removeItem('email_verified');
          localStorage.removeItem('payment_reference');
          localStorage.removeItem('payment_registration_id');

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f6fbe9] via-white to-[#eef5d6] px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">

        {/* ICON */}
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

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {status === 'verifying' && 'Verifying Payment...'}
          {status === 'success' && 'Registration Successful 🎉'}
          {status === 'failed' && 'Payment Verification Failed'}
        </h1>

        {/* MESSAGE */}
        <p className="text-gray-600 mb-6">
          {status === 'verifying' &&
            'Please wait while we confirm your payment.'}

          {status === 'success' &&
            'Your membership is now active. Welcome to the Rural Chamber of Commerce.'}

          {status === 'failed' &&
            'We could not confirm your payment. Please contact support or try again.'}
        </p>

        {/* ACTIONS */}
        {status === 'success' && (
          <div className="space-y-3">
            <Link
              href="/subscription/profile"
              className="block w-full rounded-md bg-[#9FC93B] py-3 text-sm font-medium text-white hover:bg-[#8ab52e]"
            >
              Manage Subscriptions
            </Link>

            <Link
              href="/settings"
              className="block w-full rounded-md border py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Account
            </Link>
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

        <p className="text-xs text-gray-500 mt-6">
          Need help? support@ruralchamber.co.za
        </p>
      </div>
    </div>
  );
}

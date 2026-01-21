// app/registration/success/page.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RegistrationSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any remaining registration data
    localStorage.removeItem('user_data');
    localStorage.removeItem('continue_registration');
    localStorage.removeItem('email_verified');
    localStorage.removeItem('payment_reference');
    localStorage.removeItem('payment_registration_id');
    
    toast.success('Registration completed successfully!');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="rounded-full bg-green-100 w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h2 className="text-3xl font-extrabold text-gray-900">Welcome to Rural Chamber of Commerce!</h2>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Your registration and payment have been successfully processed.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>✅ Your account has been activated</li>
              <li>✅ You can now access all member benefits</li>
              <li>✅ Check your email for confirmation</li>
              <li>✅ Visit the Connect Hub to start networking</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4 pt-6">
          <Link
            href="/connect-hub"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#9FC93B] hover:bg-[#8ab52e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9FC93B]"
          >
            Go to Connect Hub
          </Link>
          
          <Link
            href="/dashboard"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9FC93B]"
          >
            Go to Dashboard
          </Link>
          
          <Link
            href="/"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9FC93B]"
          >
            Back to Home
          </Link>
        </div>

        <p className="text-xs text-gray-500 pt-6">
          Need help? Contact us at support@ruralchamber.co.za
        </p>
      </div>
    </div>
  );
}
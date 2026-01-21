// app/registration/failed/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function RegistrationFailedPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'Payment was not completed successfully';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="rounded-full bg-red-100 w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        
        <h2 className="text-3xl font-extrabold text-gray-900">Payment Not Completed</h2>
        
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-700">{reason}</p>
          <p className="text-sm text-red-600 mt-2">
            Your registration is saved, but payment needs to be completed.
          </p>
        </div>

        <div className="space-y-4 pt-6">
          <Link
            href="/registration"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#9FC93B] hover:bg-[#8ab52e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9FC93B]"
          >
            Return to Registration
          </Link>
          
          <Link
            href="/"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9FC93B]"
          >
            Back to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9FC93B]"
          >
            Go Back
          </button>
        </div>

        <p className="text-xs text-gray-500 pt-6">
          If you need assistance, contact support@ruralchamber.co.za
        </p>
      </div>
    </div>
  );
}
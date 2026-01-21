// components/auth/AdminProtectedRoute.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isAdmin, checkAuthStatus } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    setIsChecking(false);
  }, []);

  useEffect(() => {
    if (!isChecking) {
      if (!isLoggedIn) {
        // Store the attempted admin URL
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        router.push('/auth/login');
      } else if (!isAdmin) {
        // User is logged in but not an admin
        router.push('/admin/dashboard'); // or any other non-admin page
      }
    }
  }, [isLoggedIn, isAdmin, isChecking, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
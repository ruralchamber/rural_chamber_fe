// components/auth/ProtectedRoute.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, checkAuthStatus } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    
    checkAuthStatus();
    setIsChecking(false);
  }, []);

  useEffect(() => {
    if (!isChecking && !isLoggedIn) {
        
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      router.push('/auth/login');
    }
  }, [isLoggedIn, isChecking, router]);

  
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  
  return <>{children}</>;
}

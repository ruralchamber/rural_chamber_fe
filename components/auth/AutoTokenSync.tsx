// components/auth/AutoTokenSync.tsx
"use client";

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authUtils } from '@/app/api/lib/auth-utils';

export function AutoTokenSync() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    
    const syncTokens = () => {
      const oldAccessToken = localStorage.getItem('access_token');
      const oldRefreshToken = localStorage.getItem('refresh_token');
      const oldUserData = localStorage.getItem('user_data');

      const newAccessToken = localStorage.getItem('accessToken');
      const newRefreshToken = localStorage.getItem('refreshToken');
      const newUserInfo = localStorage.getItem('userInfo');

      let updated = false;

      if (oldAccessToken && oldAccessToken !== newAccessToken) {
        localStorage.setItem('accessToken', oldAccessToken);
        updated = true;
      }

      if (oldRefreshToken && oldRefreshToken !== newRefreshToken) {
        localStorage.setItem('refreshToken', oldRefreshToken);
        updated = true;
      }

      if (oldUserData && oldUserData !== newUserInfo) {
        localStorage.setItem('userInfo', oldUserData);
        updated = true;
      }

      if (newAccessToken && newAccessToken !== oldAccessToken) {
        localStorage.setItem('access_token', newAccessToken);
        updated = true;
      }

      if (newRefreshToken && newRefreshToken !== oldRefreshToken) {
        localStorage.setItem('refresh_token', newRefreshToken);
        updated = true;
      }

      if (newUserInfo && newUserInfo !== oldUserData) {
        localStorage.setItem('user_data', newUserInfo);
        updated = true;
      }

      if (updated) {
        console.log('✅ Token sync completed');
      }
    };

    const checkAndRedirect = () => {
      const isAuthenticated = authUtils.isAuthenticated();
      const userData = authUtils.getUserData();
      
      if (isAuthenticated && userData) {
        const isAdmin = userData.role === 'admin';
        const isOnAdminPage = pathname?.startsWith('/admin');
        const isOnLoginPage = pathname === '/admin/login';
        const isOnHomePage = pathname === '/';
        
        if (isAdmin && (isOnHomePage || isOnLoginPage)) {
          console.log('🔄 Admin detected on homepage/login, redirecting to admin dashboard');
          router.push('/admin/dashboard');
        }
        
        if (!isAdmin && isOnAdminPage) {
          console.log('🚫 Regular user trying to access admin, redirecting to user hub');
          router.push('/connect-hub');
        }
      }
    };

    syncTokens();
    checkAndRedirect();

    window.addEventListener('storage', syncTokens);

    return () => {
      window.removeEventListener('storage', syncTokens);
    };
  }, [pathname, router]);

  return null;
}
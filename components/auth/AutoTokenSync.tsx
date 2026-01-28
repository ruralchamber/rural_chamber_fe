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
        try {
          const parsedUserData = JSON.parse(oldUserData);
          localStorage.setItem('userInfo', JSON.stringify(parsedUserData));
          updated = true;
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
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
        try {
          const parsedUserInfo = JSON.parse(newUserInfo);
          localStorage.setItem('user_data', JSON.stringify(parsedUserInfo));
          updated = true;
        } catch (e) {
          console.error('Failed to parse user info:', e);
        }
      }

      if (updated) {
        console.log('✅ Token sync completed');
      }
    };

    const checkAndRedirect = () => {
      const isAuthenticated = authUtils.isAuthenticated();
      const userData = authUtils.getUserData();
      
      if (!isAuthenticated) {
        sessionStorage.removeItem('redirectAfterLogin');
        return;
      }
      
      if (isAuthenticated && userData) {
        const isAdmin = userData.role === 'admin';
        const isOnAdminPage = pathname?.startsWith('/admin');
        const isOnLoginPage = pathname === '/auth/login' || pathname === '/admin/login';
        const isOnHomePage = pathname === '/';
        
        if (isAdmin && (isOnHomePage || isOnLoginPage)) {
          router.push('/admin/dashboard');
        }
        
        if (!isAdmin && isOnAdminPage) {
          router.push('/connect-hub');
        }
        
        if (!isAdmin && isOnHomePage) {
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
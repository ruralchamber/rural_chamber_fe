// contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authUtils } from '@/app/api/lib/auth-utils';
import { usePathname, useRouter } from 'next/navigation';

interface UserData {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: UserData | null;
  checkAuthStatus: () => { isAuth: boolean; isAdmin: boolean; user: UserData | null };
  logout: () => void;
  refreshUser: () => Promise<void>;
  redirectBasedOnRole: (fromLogin?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Wrap with useCallback to maintain stable reference
  const checkAuthStatus = useCallback(() => {
    authUtils.syncTokens();

    const isAuth = authUtils.isAuthenticated();
    const userData = authUtils.getUserData();

    setIsLoggedIn(isAuth);
    setUser(userData);

    const adminStatus = userData?.role === 'admin';
    setIsAdmin(adminStatus);

    return { isAuth, isAdmin: adminStatus, user: userData };
  }, []); // No dependencies needed since it only uses authUtils (which is stable)

  // Also wrap redirectBasedOnRole since it depends on checkAuthStatus and pathname
  const redirectBasedOnRole = useCallback((fromLogin: boolean = false) => {
    const { isAuth, isAdmin: adminCheck } = checkAuthStatus();

    if (!isAuth) {
      return;
    }
    if (fromLogin) {
      if (adminCheck) {
        console.log('🔄 Admin logged in, redirecting to admin dashboard');
        router.push('/admin/dashboard');
      } else {
        console.log('🔄 Regular user logged in, redirecting to connect-hub');
        router.push('/connect-hub');
      }
      return;
    }

    if (adminCheck) {
      const isOnAdminPage = pathname?.startsWith('/admin');
      const isOnLoginPage = pathname === '/auth/login';
      const isOnHomePage = pathname === '/';

      if ((isOnHomePage || isOnLoginPage) && !isOnAdminPage) {
        console.log('🔄 Admin on homepage/login, redirecting to admin dashboard');
        router.push('/admin/dashboard');
      }
    } else {
      if (pathname?.startsWith('/admin')) {
        console.log('🚫 Regular user trying to access admin, redirecting to user hub');
        router.push('/connect-hub');
      }
    }
  }, [checkAuthStatus, pathname, router]); // Add dependencies

  const refreshUser = useCallback(async () => {
    console.log('🔄 Refreshing user data...');
    checkAuthStatus();
  }, [checkAuthStatus]);

  const logout = useCallback(() => {
    console.log('👋 Logging out...');
    authUtils.clearAuthData();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);

    router.push('/auth/login');
  }, [router]);

  useEffect(() => {
    const authData = checkAuthStatus();
    setIsInitialized(true);

    if (authData.isAuth) {
      redirectBasedOnRole();
    }
  }, [checkAuthStatus, redirectBasedOnRole]); // Add dependencies

  useEffect(() => {
    if (isInitialized) {
      redirectBasedOnRole();
    }
  }, [pathname, isInitialized, redirectBasedOnRole]); // Add redirectBasedOnRole

  useEffect(() => {
    const interval = setInterval(() => {
      if (authUtils.isAuthenticated()) {
        authUtils.syncTokens();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      isAdmin,
      user,
      checkAuthStatus,
      logout,
      refreshUser,
      redirectBasedOnRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
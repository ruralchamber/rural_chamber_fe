// app/api/lib/auth-utils.ts
'use client';

import Cookies from 'universal-cookie';

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

interface UserData {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

const cookies = new Cookies();

const TOKEN_KEYS = {
  COOKIE_TOKEN: 'token',
  COOKIE_USER: 'user_data',
  COOKIE_ACCESS: 'access_token',
  LOCAL_ACCESS: 'accessToken',
  LOCAL_REFRESH: 'refreshToken',
  LOCAL_USER: 'userInfo'
} as const;

export const authUtils = {

  setAuthData: (tokenData: TokenData, userData: UserData) => {
    const expiresDate = new Date(tokenData.expiresAt);
    const cookieOptions = {
      expires: expiresDate,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const
    };

    cookies.set(TOKEN_KEYS.COOKIE_TOKEN, JSON.stringify(tokenData), cookieOptions);
    cookies.set(TOKEN_KEYS.COOKIE_USER, JSON.stringify(userData), cookieOptions);
    cookies.set(TOKEN_KEYS.COOKIE_ACCESS, tokenData.accessToken, cookieOptions);

    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEYS.LOCAL_ACCESS, tokenData.accessToken);
      localStorage.setItem(TOKEN_KEYS.LOCAL_REFRESH, tokenData.refreshToken);
      localStorage.setItem(TOKEN_KEYS.LOCAL_USER, JSON.stringify(userData));
      
      localStorage.setItem('access_token', tokenData.accessToken);
      localStorage.setItem('user_data', JSON.stringify(userData));
    }

    console.log('✅ Auth data stored successfully');
  },

  getAccessToken: (): string | null => {
    try {
      const tokenCookie = cookies.get(TOKEN_KEYS.COOKIE_TOKEN);
      if (tokenCookie?.accessToken) {
        return tokenCookie.accessToken;
      }
    } catch (error) {
      console.warn('Failed to parse token cookie:', error);
    }

    const accessCookie = cookies.get(TOKEN_KEYS.COOKIE_ACCESS);
    if (accessCookie) {
      return accessCookie;
    }

    if (typeof window !== 'undefined') {
      const localToken = localStorage.getItem(TOKEN_KEYS.LOCAL_ACCESS) || 
                        localStorage.getItem('access_token');
      if (localToken) {
        return localToken;
      }
    }

    return null;
  },

  getUserData: (): UserData | null => {
    try {
      const userCookie = cookies.get(TOKEN_KEYS.COOKIE_USER);
      if (userCookie) {
        return typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
      }
    } catch (error) {
      console.warn('Failed to parse user cookie:', error);
    }

    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(TOKEN_KEYS.LOCAL_USER) || 
                      localStorage.getItem('user_data');
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (error) {
          console.warn('Failed to parse user data:', error);
        }
      }
    }

    return null;
  },

  getUserRole: (): string | null => {
    const userData = authUtils.getUserData();
    return userData?.role || null;
  },

  isAdmin: (): boolean => {
    const role = authUtils.getUserRole();
    return role === 'admin';
  },

  isAuthenticated: (): boolean => {
    const token = authUtils.getAccessToken();
    if (!token) return false;

    try {
      const tokenData = cookies.get(TOKEN_KEYS.COOKIE_TOKEN);
      if (tokenData?.expiresAt) {
        const expiresAt = new Date(tokenData.expiresAt);
        if (expiresAt <= new Date()) {
          console.log('❌ Token expired');
          authUtils.clearAuthData();
          return false;
        }
      }
    } catch (error) {
      console.warn('Failed to check token expiration:', error);
    }

    return true;
  },

  syncTokens: () => {
    const token = authUtils.getAccessToken();
    const userData = authUtils.getUserData();

    if (token && userData) {
      const cookieToken = cookies.get(TOKEN_KEYS.COOKIE_TOKEN);
      
      if (!cookieToken && typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem(TOKEN_KEYS.LOCAL_REFRESH) || 
                           localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          const tokenData: TokenData = {
            accessToken: token,
            refreshToken: refreshToken,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          };
          authUtils.setAuthData(tokenData, userData);
        }
      }
    }
  },

  clearAuthData: () => {
    cookies.remove(TOKEN_KEYS.COOKIE_TOKEN, { path: '/' });
    cookies.remove(TOKEN_KEYS.COOKIE_USER, { path: '/' });
    cookies.remove(TOKEN_KEYS.COOKIE_ACCESS, { path: '/' });

    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEYS.LOCAL_ACCESS);
      localStorage.removeItem(TOKEN_KEYS.LOCAL_REFRESH);
      localStorage.removeItem(TOKEN_KEYS.LOCAL_USER);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    }

    console.log('✅ Auth data cleared');
  }
};
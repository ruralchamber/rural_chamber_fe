// app/auth/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/common/AuthLayout';
import Link from 'next/link';
import { IUserLogin } from '@/interfaces/auth';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';
import { AUTH_API } from '@/app/api/endpoints/rest-api/auth/auth';
import { authUtils } from '@/app/api/lib/auth-utils';
import { useAuth } from '@/context/AuthContext';

interface IDecodedJWT {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { checkAuthStatus } = useAuth();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const loginData: IUserLogin = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      const response = await AUTH_API.LOGIN_POST(loginData);
      
      if (response.success === true && response.data?.accessToken) {
        const decodedUser = jwtDecode<IDecodedJWT>(response.data.accessToken);
        
        authUtils.setAuthData(
          {
            ...response.data,
            expiresAt: response.data.expiresAt instanceof Date 
              ? response.data.expiresAt.toISOString() 
              : response.data.expiresAt
          },
          {
            id: decodedUser.id,
            email: decodedUser.email,
            fullName: decodedUser.fullName,
            role: decodedUser.role
          }
        );
        
        checkAuthStatus();
        
        toast.success('Login successful! Welcome back.');
        
        if (decodedUser.role === 'admin') {
          
          console.log('👑 Admin detected, redirecting to admin dashboard');
          router.push('/admin/dashboard');
        } else {
          
          const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/connect-hub';
          sessionStorage.removeItem('redirectAfterLogin');
          router.push(redirectUrl);
        }
        
      } else {
        let errorMessage = 'Login failed. Please try again.';
        
        if (typeof response.error === 'string') {
          errorMessage = response.error;
        } else if (response.message) {
          errorMessage = response.message;
        }
        
        setErrors({ general: errorMessage });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      let errorMessage = 'Invalid credentials. Please check your email and password and try again.';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData.error === 'string') {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      rightImage="/login.png"
      rightTitle="Continue to Grow and Learn."
    >
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Login</h1>
        <p className="text-gray-500 text-sm mb-8">
          Please login to continue to your account.
        </p>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent text-sm pr-12 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 text-[#9FC93B] border-gray-300 rounded focus:ring-[#9FC93B] disabled:opacity-50"
              />
              <span className="ml-2 text-gray-700">Keep me logged in</span>
            </label>

            <Link 
              href="/auth/forgot-password"
              className="text-[#9FC93B] hover:text-[#89B534] font-medium"
            >
              Forgot password
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9FC93B] hover:bg-[#89B534] text-white font-medium py-3 rounded-md transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center text-sm text-gray-600">
            Need an account?{' '}
            <Link 
              href="/auth/signup"
              className="text-[#9FC93B] hover:text-[#89B534] font-medium underline"
            >
              Create one
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
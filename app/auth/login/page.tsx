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

interface FormMessages {
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
  const [messages, setMessages] = useState<FormMessages>({});
  const { checkAuthStatus } = useAuth();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newMessages: FormMessages = {};

    if (!formData.email) {
      newMessages.email = "Email is required to continue";
    } else if (!validateEmail(formData.email)) {
      newMessages.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newMessages.password = "Password is required to continue";
    }

    setMessages(newMessages);
    return Object.keys(newMessages).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (messages[name as keyof FormMessages]) {
      setMessages((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const getErrorMessage = (error: any): string => {
    if (!error) return 'An unknown error occurred';
    
    const errorData = error.response?.data || error;
    
    if (errorData.error && typeof errorData.error === 'string') {
      if (errorData.error.includes('Invalid password')) {
        return 'Invalid password. Please try again.';
      }
      if (errorData.error.includes('Email') && errorData.error.includes('not found')) {
        return 'Email not found. Please check your email or sign up for an account.';
      }
      return errorData.error;
    }
    
    if (errorData.message) {
      if (errorData.message.includes('Invalid password')) {
        return 'Invalid password. Please try again.';
      }
      if (errorData.message.includes('Email') && errorData.message.includes('not found')) {
        return 'Email not found. Please check your email or sign up for an account.';
      }
      return errorData.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'Unable to log in. Please check your credentials and try again.';
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessages({});

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
    
    if (response.error) {
      if (response.data?.needsToCompleteRegistration) {
        toast.info("Please complete your registration first.", {
          duration: 6000,
          action: {
            label: "Continue Registration",
            onClick: () => {
              localStorage.setItem("user_data", JSON.stringify(response.data.user));
              localStorage.setItem("registration_in_progress", "true");
              localStorage.setItem("current_registration_step", 
                response.data.resumeStep?.toString() || "1"
              );
              
              const registrationData = {
                email: loginData.email,
              };
              localStorage.setItem("registration_data", JSON.stringify(registrationData));
              
              router.push("/auth/register");
            },
          },
        });
        setLoading(false);
        return;
      }
      
      const errorMessage = getErrorMessage(response);
      setMessages({ general: errorMessage });
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

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
      
      toast.success('Welcome back! Login successful.');
      
      localStorage.removeItem("registration_in_progress");
      localStorage.removeItem("current_registration_step");
      localStorage.removeItem("registration_data");
      
      if (decodedUser.role === 'admin') {
        sessionStorage.removeItem('redirectAfterLogin');
        router.push('/admin/dashboard');
      } else {
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/connect-hub';
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      }
      
    } else {
      const errorMessage = getErrorMessage(response);
      setMessages({ general: errorMessage });
      toast.error(errorMessage);
    }
  } catch (err: any) {
    const errorMessage = getErrorMessage(err);
    setMessages({ general: errorMessage });
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
}


  return (
    <AuthLayout
      rightImage="/login.png"
      rightTitle="Continue to Grow and Learn."
    >
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-500 text-sm mb-8">
          Please enter your credentials to access your account.
        </p>

        {messages.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {messages.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                messages.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {messages.email && (
              <p className="text-red-600 text-xs mt-1">{messages.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent text-sm pr-12 disabled:opacity-50 disabled:cursor-not-allowed ${
                  messages.password ? 'border-red-500' : 'border-gray-300'
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
            </div>
            {messages.password && (
              <p className="text-red-600 text-xs mt-1">{messages.password}</p>
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
              Forgot password?
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
                Signing you in...
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
              Create one here
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
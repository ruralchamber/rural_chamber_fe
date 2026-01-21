'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeClosed } from 'lucide-react';

interface InitialRegistrationData {
  email: string;
  cellphone: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

interface InitialRegistrationStepProps {
  data: any;
  onSubmit: (data: {
    email: string;
    cellphone: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => void;
  isLoading: boolean;
}

export const InitialRegistrationStep = ({
  data,
  onSubmit,
  isLoading,
}: InitialRegistrationStepProps) => {
  const [formData, setFormData] = useState<InitialRegistrationData>({
    email: data.email || "",
    cellphone: data.cellphone || "",
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    password: data.password || "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<InitialRegistrationData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof InitialRegistrationData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<InitialRegistrationData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.cellphone.trim()) {
      newErrors.cellphone = "Cellphone number is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...submitData } = formData;
    onSubmit(submitData);
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const hasConfirmPassword = formData.confirmPassword.length > 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h2>
      <p className="text-gray-500 text-sm mb-6">
        Enter your basic information to get started with your Rural Chamber of Commerce membership
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name *"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name *"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="tel"
            name="cellphone"
            placeholder="Cellphone Number *"
            value={formData.cellphone}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${
              errors.cellphone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.cellphone && (
            <p className="text-sm text-red-500 mt-1">{errors.cellphone}</p>
          )}
        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password * (min. 6 characters)"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm pr-12 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeClosed/> : <Eye/>}
          </button>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password *"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm pr-12 ${
              hasConfirmPassword 
                ? passwordsMatch 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-red-500 bg-red-50'
                : errors.confirmPassword 
                  ? 'border-red-500' 
                  : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeClosed/> : <Eye/>}
          </button>
          {hasConfirmPassword && (
            <div className={`text-sm font-medium mt-1 ${
              passwordsMatch ? 'text-green-600' : 'text-red-600'
            }`}>
              {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
            </div>
          )}
          {errors.confirmPassword && !hasConfirmPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#9FC93B] hover:bg-[#89B534] text-white font-medium py-3 rounded-md transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Account...
            </>
          ) : (
            'Create Account & Continue'
          )}
        </button>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            href="/auth/login"
            className="text-[#9FC93B] hover:text-[#89B534] font-medium underline"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};
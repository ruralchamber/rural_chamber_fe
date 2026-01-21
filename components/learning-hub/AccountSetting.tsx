"use client";

import React, { useState, useEffect } from 'react';
import { X, Check, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { USER_PROFILE_API } from '@/app/api/endpoints/rest-api/user/user-profile';
import { toast } from 'sonner';

export default function AccountSettings() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    industry: '',
    password: '************'
  });

  const industries = [
    'Agricultural',
    'Technology',
    'Manufacturing',
    'Healthcare',
    'Education',
    'Finance',
    'Retail',
    'Other'
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await USER_PROFILE_API.GET_PROFILE();
      
      if (response.data) {
        setFormData({
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          phone: response.data.cellphone || '',
          industry: response.data.sector || '',
          password: '************'
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error(error.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await USER_PROFILE_API.DELETE_ACCOUNT();
      
      if (response.data) {
        setShowDeleteDialog(false);
        setShowSuccessDialog(true);
        
        setTimeout(() => {
          logout();
          router.push('/');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error(error.message || 'Failed to delete account');
      setShowDeleteDialog(false);
    }
  };

  useEffect(() => {
    if (showSuccessDialog) {
      const timer = setTimeout(() => {
        setShowSuccessDialog(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessDialog]);

  const handleUpdateProfile = () => {
    router.push('/update-profile');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-12">
            Account Settings
          </h1>

          <div className="space-y-6 mb-8">
           
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent text-gray-900 bg-gray-50 cursor-not-allowed"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent text-gray-900 bg-gray-50 cursor-not-allowed"
              />
              
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent text-gray-900 bg-gray-50 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="relative">
                <select
                  name="industry"
                  value={formData.industry}
                  disabled
                  className="w-full px-4 py-3 border-2 border-[#9FC93B] bg-[#F5F9E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FC93B] appearance-none cursor-not-allowed text-[#9FC93B] font-medium"
                >
                  <option value="">Select Industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9FC93B] pointer-events-none" />
              </div>

              
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  readOnly
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent text-gray-900 bg-gray-50 cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
            <button
              onClick={handleUpdateProfile}
              className="w-full sm:w-auto px-8 py-3 bg-[#9FC93B] text-white rounded-lg font-medium hover:bg-[#8AB82F] transition-colors"
            >
              Update Profile
            </button>
            <button
              onClick={handleDeleteClick}
              className="w-full sm:w-auto text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-10 max-w-md w-full shadow-2xl">
            <h3 className="text-center text-gray-800 text-xl font-bold mb-4">
              Delete Account
            </h3>
            <p className="text-center text-gray-700 text-base leading-relaxed mb-8">
              Are you sure you want to delete your account?<br />
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-12 py-2.5 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-12 py-2.5 rounded-lg font-medium transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessDialog && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-10 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowSuccessDialog(false)}
              className="absolute top-4 right-4 text-[#9FC93B] hover:text-[#8AB82F]"
            >
              <X className="h-6 w-6" strokeWidth={2} />
            </button>
            <div className="flex flex-col items-center pt-4">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <Check className="h-12 w-12 text-white" strokeWidth={3} />
              </div>
              <p className="text-center text-gray-700 text-base font-normal">
                Account successfully deleted
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
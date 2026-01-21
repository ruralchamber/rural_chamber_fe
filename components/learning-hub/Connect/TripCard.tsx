"use client";

import React from 'react';
import { BusinessTrips } from './BusinessTrip';
import { HeroSection } from '@/components/common/HeroSection';
import { CTAParallaxSection } from '@/components/home/CTAParallexSection';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function TripCard() {
  const router = useRouter();

  const handleBecomeMember = () => {
    router.push('/membership');
  };

  return (
    <div className="min-h-screen bg-gray-50">
     
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Business Trips</h1>
            <p className="text-gray-600 text-sm mt-1 hidden sm:block">
              Discover exclusive networking opportunities and business trips
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
        </div>
      </div>

      <div className="bg-linear-to-br from-blue-50 to-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Expand Your Network Across Africa
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join fellow rural entrepreneurs on exclusive business trips designed to create 
            meaningful connections and unlock new opportunities.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BusinessTrips />
      </div>

      <CTAParallaxSection
        backgroundImage="/services/money.png"
        title="Unlock exclusive business trips and networking opportunities!"
        buttonText="Upgrade Membership"
        onButtonClick={handleBecomeMember}
      />
    </div>
  );
}
// app/components/registration/steps/PaymentStep.tsx - SIMPLIFIED
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PaymentButton } from "@/components/payment/PaymentButton";
import { REGISTRATION_API } from "@/app/api/endpoints/rest-api/registration/registration";

interface PaymentData {
  email: string;
  firstName: string;
  lastName: string;
  membershipType: string;
  amount: number;
  billingFrequency: "monthly" | "annual";
  registrationId?: number;
}

interface PaymentStepProps {
  data: PaymentData;
  
  onBack: () => void;
}

export const PaymentStep = ({ data, onBack }: PaymentStepProps) => {
  const router = useRouter();
  const [registration, setRegistration] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Load registration data
  useEffect(() => {
    const loadRegistrationData = async () => {
      try {
        const userData = localStorage.getItem("user_data");
        if (userData) {
          const user = JSON.parse(userData);

          try {
            const progressResponse = await REGISTRATION_API.GET_PROGRESS(
              user.id
            );
            if (progressResponse.data?.registration) {
              setRegistration(progressResponse.data.registration);
            }
          } catch (error) {
            console.error("Failed to get registration:", error);
          }
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRegistrationData();
  }, []);

 
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment information...</p>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">
          Unable to load payment information. Please try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-[#9FC93B] text-white px-6 py-2 rounded-md"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  const paymentData = {
    ...data,
    registrationId: registration.id,
    crm_id: data.email,
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Complete Your Payment
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Click the button below to open the payment modal
      </p>

      <div className="space-y-6">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium text-lg">
                {formatAmount(data.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Member:</span>
              <span className="font-medium">
                {data.firstName} {data.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{data.email}</span>
            </div>
            {data.billingFrequency === "monthly" && (
              <div className="flex justify-between">
                <span className="text-gray-600">Frequency:</span>
                <span className="font-medium text-amber-600">
                  Monthly (Recurring)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <span className="text-blue-600">💡</span>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">How It Works</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Click "Pay" to initialize payment</li>
                <li>2. A secure Paystack modal will open</li>
                <li>3. Enter your card details</li>
                <li>4. Payment verifies automatically</li>
                <li>5. Registration completes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="text-center">
          <PaymentButton paymentData={paymentData} />
        </div>

        {/* Back Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isProcessingPayment}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-md transition-colors duration-200 text-sm disabled:opacity-50"
          >
            ← Back to Membership Selection
          </button>
        </div>
      </div>
    </div>
  );
};

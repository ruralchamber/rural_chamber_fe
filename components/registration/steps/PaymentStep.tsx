"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { PAYMENT_API } from "@/app/api/endpoints/rest-api/payment/payment";
import { REGISTRATION_API } from "@/app/api/endpoints/rest-api/registration/registration";

interface PaymentStepProps {
  data: {
    email: string;
    firstName: string;
    lastName: string;
    membershipType: string;
    amount: number;
    billingFrequency: "monthly" | "annual";
  };
  onBack: () => void;
  onSuccess?: () => void;
}

export const PaymentStep = ({ data, onBack, onSuccess }: PaymentStepProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"paystack">("paystack");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);

  // Check for payment callback
  useEffect(() => {
    const checkPaymentCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const reference = urlParams.get("reference");
      const trxref = urlParams.get("trxref");

      const paymentRef = reference || trxref;

      if (paymentRef && !paymentCompleted) {
        setIsProcessing(true);
        try {
          const verificationResponse =
            await PAYMENT_API.VERIFY_PAYMENT(paymentRef);

          if (verificationResponse.error) {
            toast.error(
              verificationResponse.message || "Payment verification failed",
            );
            setIsProcessing(false);
            return;
          }

          if (verificationResponse.data?.status === "success") {
            setPaymentCompleted(true);
            setPaymentReference(paymentRef);

            // Clear URL parameters
            const newUrl = window.location.pathname;
            window.history.replaceState({}, "", newUrl);

            // Complete registration
            await completeRegistrationAfterPayment();

            toast.success(
              "Payment successful! Your membership has been activated.",
            );

            // Redirect after 3 seconds
            setTimeout(() => {
              if (onSuccess) {
                onSuccess();
              } else {
                window.location.href = "/client/dashboard";
              }
            }, 3000);
          } else {
            toast.error("Payment failed or is pending");
          }
        } catch (error: any) {
          console.error("Payment verification error:", error);
          toast.error("Failed to verify payment");
        } finally {
          setIsProcessing(false);
        }
      }
    };

    checkPaymentCallback();
  }, [paymentCompleted]);

  const completeRegistrationAfterPayment = async () => {
    try {
      const userDataStr = localStorage.getItem("user_data");
      const userData = userDataStr ? JSON.parse(userDataStr) : null;

      if (!userData || !userData.id) {
        throw new Error("User session expired");
      }

      // Get registration data from localStorage
      const registrationDataStr = localStorage.getItem("registration_data");
      const registrationData = registrationDataStr
        ? JSON.parse(registrationDataStr)
        : {};

      const completeResponse = await REGISTRATION_API.COMPLETE_REGISTRATION({
        userId: userData.id,
        finalData: {
          ...registrationData,
          membershipType: data.membershipType,
          membershipAmount: data.amount,
          billingFrequency: data.billingFrequency,
        },
      });

      if (completeResponse.error) {
        console.error(
          "Failed to complete registration:",
          completeResponse.message,
        );
        // Don't throw error here - payment was successful even if registration completion fails
      }

      // Clean up registration data
      localStorage.removeItem("registration_in_progress");
      localStorage.removeItem("registration_data");
      localStorage.removeItem("current_registration_step");
      localStorage.removeItem("pending_payment_reference");
      localStorage.removeItem("pending_payment_data");
    } catch (error: any) {
      console.error("Error completing registration:", error);
      // Payment was successful even if registration cleanup fails
    }
  };

  const handlePayment = async () => {
    if (!data.amount || data.amount <= 0) {
      toast.error("Invalid payment amount");
      return;
    }

    setIsProcessing(true);

    try {
      // Get user data from localStorage
      const userDataStr = localStorage.getItem("user_data");
      const userData = userDataStr ? JSON.parse(userDataStr) : null;

      if (!userData || !userData.id) {
        toast.error("User session expired. Please login again.");
        return;
      }

      // Get registration ID from registration progress
      let registrationId = null;
      let registrationData = null;

      try {
        const progressResponse = await REGISTRATION_API.GET_PROGRESS(
          userData.id,
        );
        if (!progressResponse.error && progressResponse.data?.registration) {
          registrationId = progressResponse.data.registration.id;
          registrationData = progressResponse.data.registration;
        }
      } catch (error) {
        console.error("Failed to get registration progress:", error);
      }

      if (!registrationId) {
        toast.error("Unable to find registration. Please try again.");
        return;
      }

      // Verify registration has the selected membership type
      if (registrationData?.membershipType !== data.membershipType) {
        toast.error(
          "Membership selection mismatch. Please go back and reselect your membership.",
        );
        setIsProcessing(false);
        return;
      }

      if (registrationData?.billingFrequency !== data.billingFrequency) {
        toast.error(
          "Billing frequency mismatch. Please go back and reselect your billing frequency.",
        );
        setIsProcessing(false);
        return;
      }

      const paymentData = {
        email: data.email,
        amount: data.amount,
        membershipType: data.membershipType,
        billingFrequency: data.billingFrequency,
        firstName: data.firstName,
        lastName: data.lastName,
        registrationId: registrationId,
        userId: userData.id,
      };

      const response = await PAYMENT_API.INITIALIZE_PAYMENT(paymentData);

      if (response.error) {
        let errorMessage = response.message || "Payment initialization failed";

        // Handle specific errors
        if (errorMessage.includes("Membership type mismatch")) {
          errorMessage =
            "Membership selection doesn't match your registration. Please go back and reselect your membership.";
        } else if (errorMessage.includes("Billing frequency mismatch")) {
          errorMessage =
            "Billing frequency doesn't match your registration. Please go back and reselect your billing frequency.";
        } else if (errorMessage.includes("Invalid payment amount")) {
          errorMessage =
            "Payment amount doesn't match the selected plan. Please go back and reselect your membership.";
        }

        toast.error(errorMessage);
        setIsProcessing(false);
        return;
      }

      if (response.data?.authorization_url) {
        // Save payment reference for verification
        localStorage.setItem(
          "pending_payment_reference",
          response.data.reference,
        );

        // Redirect to payment page
        window.location.href = response.data.authorization_url;
      } else {
        toast.error("No payment URL received from payment gateway");
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error("Payment error:", error);

      let errorMessage = "Payment failed. Please try again.";
      if (error.message) {
        if (error.message.includes("Network Error")) {
          errorMessage =
            "Network error. Please check your internet connection and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Payment request timed out. Please try again.";
        }
      }

      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  if (paymentCompleted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Your membership has been activated successfully.
          </p>
          {paymentReference && (
            <p className="text-xs text-gray-400 mb-6">
              Reference: {paymentReference}
            </p>
          )}
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-4">
            Membership Activated
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-green-700">Plan</span>
              <span className="font-medium text-green-900">
                {data.membershipType.replace("_", " ").toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Billing</span>
              <span className="font-medium text-green-900">
                {data.billingFrequency === "monthly" ? "Monthly" : "Annual"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Amount Paid</span>
              <span className="font-bold text-green-900">
                R {data.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            Redirecting to dashboard in a few seconds...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Complete Payment
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Secure payment to activate your membership
      </p>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Membership Plan</span>
            <span className="font-medium">
              {data.membershipType.replace("_", " ").toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Billing</span>
            <span className="font-medium">
              {data.billingFrequency === "monthly" ? "Monthly" : "Annual"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount</span>
            <span className="font-medium">R {data.amount.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Due</span>
              <span className="text-green-600">R {data.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
        <div className="space-y-3">
          <div
            className={`flex items-center space-x-3 border rounded-lg p-4 ${
              paymentMethod === "paystack"
                ? "border-[#9FC93B] bg-green-50"
                : "border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Pay with Card (Paystack)</span>
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            <p>✓ Secure payment processing</p>
            <p>✓ Instant activation upon payment</p>
            <p>✓ Subscription starts immediately</p>
            <p>✓ Receipt sent to your email</p>
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> After payment, your subscription will
              be activated and you'll receive a confirmation email. You can
              manage your subscription from your dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-md transition-colors duration-200 text-sm disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex-1 bg-[#9FC93B] hover:bg-[#89B534] text-white font-medium py-3 rounded-md transition-colors duration-200 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay R ${data.amount.toFixed(2)}`
          )}
        </button>
      </div>
    </div>
  );
};

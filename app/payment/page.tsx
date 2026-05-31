"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreditCard,
  Lock,
  Loader2,
  Check,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { PAYMENT_API } from "@/app/api/endpoints/rest-api/payment/payment";

interface SubscriptionData {
  subscriptionType: string;
  billingFrequency: "monthly" | "annual";
  amount: number;
  planName: string;
  registrationId: number;
  email: string;
  firstName: string;
  lastName: string;
  isChangeSubscription?: boolean;
  currentSubscriptionType?: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showProcessingDialog, setShowProcessingDialog] = useState(false);

  useEffect(() => {
    loadSubscriptionData();
    checkUserInfo();

    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get("reference");
    const trxref = urlParams.get("trxref");

    if (reference || trxref) {
      handlePaymentVerification(reference || trxref || "");
    }
  }, []);

  const loadSubscriptionData = () => {
    const pendingSubscription = sessionStorage.getItem("pendingSubscription");
    if (pendingSubscription) {
      try {
        const data = JSON.parse(pendingSubscription);
        setSubscriptionData(data);
      } catch (error) {
        toast.error("Invalid subscription data");
        router.push("/membership");
      }
    } else {
      toast.error("No subscription data found");
      router.push("/membership");
    }
  };

  const checkUserInfo = () => {
    try {
      const userData = localStorage.getItem("user_data");
      const userInfo = localStorage.getItem("userInfo");

      if (userData) {
        const user = JSON.parse(userData);
        setUserInfo(user);
      } else if (userInfo) {
        const user = JSON.parse(userInfo);
        setUserInfo(user);
      } else {
        toast.error("Please login to continue");
        router.push("/auth/login");
      }
    } catch (error) {
      toast.error("Failed to load user information");
      router.push("/auth/login");
    }
  };

  const handlePaymentVerification = async (reference: string) => {
    setIsLoading(true);
    try {
      toast.success("Payment successful! Verifying...");

      const response = await PAYMENT_API.VERIFY_PAYMENT(reference);

      if (response.error) {
        toast.error("Payment verification failed");
        return;
      }

      if (response.data.status === "success") {
        toast.success("Payment verified successfully!");

        const pendingSubscription = sessionStorage.getItem(
          "pendingSubscription",
        );
        if (pendingSubscription) {
          const subscriptionData = JSON.parse(pendingSubscription);

          if (subscriptionData.isChangeSubscription) {
            router.push("/subscription/profile");
          } else {
            router.push("/subscription/profile");
          }

          sessionStorage.removeItem("pendingSubscription");
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        } else {
          router.push("/subscription/profile");
        }
      } else {
        toast.error("Payment verification failed");
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      toast.error("Failed to verify payment");
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(amount);
  };

  const getSubscriptionTypeName = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handlePayment = async () => {
    if (!subscriptionData || !userInfo) {
      toast.error("Missing subscription or user information");
      return;
    }

    setIsLoading(true);
    setShowProcessingDialog(true);

    try {
      const paymentData = {
        email: subscriptionData.email || userInfo.email,
        firstName:
          subscriptionData.firstName || userInfo.fullName?.split(" ")[0] || "",
        lastName:
          subscriptionData.lastName ||
          userInfo.fullName?.split(" ").slice(1).join(" ") ||
          "",
        membershipType: subscriptionData.subscriptionType,
        billingFrequency: subscriptionData.billingFrequency,
        amount: subscriptionData.amount,
        registrationId:
          subscriptionData.registrationId || userInfo.registrationId,
        crm_id: subscriptionData.email || userInfo.email,
        userId: userInfo.id,
      };

      console.log("Payment data being sent:", paymentData);

      const response = await PAYMENT_API.INITIALIZE_PAYMENT(paymentData);

      if (response.error) {
        throw new Error(response.message || "Payment initialization failed");
      }

      if (response.data?.authorization_url) {
        setPaymentUrl(response.data.authorization_url);

        window.location.href = response.data.authorization_url;
      } else {
        throw new Error("No payment URL received from Paystack");
      }
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast.error(
        error.message || "Failed to process payment. Please try again.",
      );
      setShowProcessingDialog(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    sessionStorage.removeItem("pendingSubscription");
    router.push("/settings");
  };

  if (!subscriptionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[#9FC93B] mx-auto mb-4" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-linear-to-r from-[#01311B] to-[#024d2f] text-white py-8 px-6 sm:px-8">
            <h1 className="text-3xl font-bold text-center">
              {subscriptionData.isChangeSubscription
                ? "Change Subscription"
                : "Complete Your Payment"}
            </h1>
            <p className="text-center text-gray-200 mt-2">
              Secure payment via Paystack
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {subscriptionData.isChangeSubscription &&
              subscriptionData.currentSubscriptionType && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">
                        Changing Subscription
                      </p>
                      <p className="text-sm text-blue-800 mt-1">
                        You're changing from{" "}
                        {getSubscriptionTypeName(
                          subscriptionData.currentSubscriptionType,
                        )}{" "}
                        to{" "}
                        {getSubscriptionTypeName(
                          subscriptionData.subscriptionType,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-bold">
                      {getSubscriptionTypeName(
                        subscriptionData.subscriptionType,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Billing:</span>
                    <span className="font-medium capitalize">
                      {subscriptionData.billingFrequency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="text-2xl font-bold text-[#01311B]">
                      {formatAmount(subscriptionData.amount)}
                    </span>
                  </div>
                  {subscriptionData.billingFrequency === "monthly" && (
                    <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        ⚠️ This is a recurring monthly payment. You can cancel
                        anytime from your subscription settings.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Payment Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Pay with Paystack
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Secure payment processing via Paystack. Supports all major
                      credit/debit cards and bank transfers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Lock className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900">
                      100% Secure Payment
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      Your payment information is encrypted and never stored on
                      our servers. Paystack is PCI DSS compliant.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full bg-[#9FC93B] hover:bg-[#8AB82F] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Pay {formatAmount(subscriptionData.amount)}
                  </>
                )}
              </button>

              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel & Go to Subscription Settings
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Secure Payment
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Instant Activation
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  24/7 Support
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  PCI DSS Compliant
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {showProcessingDialog && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Processing Payment
              </h3>
              <p className="text-gray-600 mb-4">
                We're setting up your payment and redirecting you to Paystack
                for secure payment.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This should only take a moment...
              </p>
              <button
                onClick={() => {
                  setShowProcessingDialog(false);
                  setIsLoading(false);
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

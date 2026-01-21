// src/hooks/usePaymentProcessing.ts
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PAYMENT_API } from "@/app/api/endpoints/rest-api/payment/payment";

interface PaymentData {
  firstName: string;
  lastName: string;
  email: string;
  membershipType: string;
  billingFrequency: "monthly" | "annual";
  amount: number;
  registrationId: number;
  crm_id?: string;
}

export const usePaymentProcessing = () => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSuccess = useCallback(async (
    response: any,
    paymentData: PaymentData
  ) => {
    setIsProcessing(true);

    try {
      
      const verifyResponse = await PAYMENT_API.VERIFY_PAYMENT(response.reference);

      if (verifyResponse.error) {
        console.error('Payment verification failed:', verifyResponse.message);
        toast.error(verifyResponse.message || "Payment verification failed. Please contact support.");
        return;
      }

      if (verifyResponse.data.status === "success") {
        toast.success("Payment successful! Your membership is now active.");
        
        
        router.push('/dashboard?payment=success');
      } else {
        toast.error("Payment verification failed. Please try again or contact support.");
      }

    } catch (error: any) {
      console.error('Error in payment success handler:', error);
      toast.error("Payment successful but there was an error updating your membership. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  }, [router]);

  const handlePaymentClose = useCallback(() => {
    toast.info("Payment was cancelled. You can try again anytime.");
  }, []);

  return {
    isProcessing,
    handlePaymentSuccess,
    handlePaymentClose,
  };
};
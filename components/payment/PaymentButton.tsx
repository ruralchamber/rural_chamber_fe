'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { PAYMENT_API } from '@/app/api/endpoints/rest-api/payment/payment';

interface PaymentData {
  email: string;
  firstName: string;
  lastName: string;
  membershipType: string;
  billingFrequency: 'monthly' | 'annual';
  amount: number;
  registrationId: number;
  crm_id?: string;
}

interface PaymentButtonProps {
  paymentData: PaymentData;
}

export const PaymentButton = ({ paymentData }: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const response = await PAYMENT_API.INITIALIZE_PAYMENT(paymentData);

      if (response.error) {
        throw new Error(response.message || 'Failed to initialize payment');
      }

      // 🔥 REDIRECT TO PAYSTACK (NOT MODAL)
      window.location.href = response.data.authorization_url;
    } catch (error: any) {
      toast.error(error.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-[#9FC93B] hover:bg-[#89B534] text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50"
    >
      {loading ? 'Redirecting to payment...' : `Pay R${paymentData.amount.toLocaleString()}`}
    </button>
  );
};

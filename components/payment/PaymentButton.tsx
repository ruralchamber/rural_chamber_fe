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
        
        let errorMessage = 'Failed to initialize payment';
        
        if (response.message) {
          if (response.message.includes('Plan not found')) {
            errorMessage = 'This membership plan is not yet available. It will be implemented soon. Please select a different plan or try again later.';
          } else if (response.message.includes('Payment gateway error')) {
            errorMessage = 'Payment gateway error. Please try again or contact support.';
          } else {
            errorMessage = response.message;
          }
        }
        
        if (response.error && typeof response.error === 'string') {
          if (response.error.includes('Plan not found')) {
            errorMessage = 'This membership plan is not yet available. It will be implemented soon. Please select a different plan or try again later.';
          } else if (response.error.includes('Payment gateway error')) {
            errorMessage = 'Payment gateway error. Please try again or contact support.';
          }
        }
        
        throw new Error(errorMessage);
      }

      window.location.href = response.data.authorization_url;
    } catch (error: any) {
      
      let userFriendlyMessage = error.message || 'Payment initialization failed';
      
      if (error.message.includes('Plan not found')) {
        userFriendlyMessage = 'This membership plan is not yet available. It will be implemented soon. Please select a different plan or try again later.';
      } else if (error.message.includes('not yet available') || error.message.includes('soon to be')) {
        userFriendlyMessage = error.message;
      }
      
      toast.error(userFriendlyMessage);
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
import { POST, GET } from "@/app/api/lib/client";
import { CustomResponse } from "@/interfaces/response";
import { baseUrl } from "../../url";

const PaymentBaseURL = `${baseUrl}/payment`;

export interface PaymentData {
  email: string;
  amount: number;
  membershipType: string;
  billingFrequency: "monthly" | "annual";
  firstName: string;
  lastName: string;
  registrationId: number;
  crm_id?: string;
}

export interface PaymentResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaymentVerificationResponse {
  reference: string;
  status: "success" | "failed" | "pending";
  gatewayResponse: any;
  paymentDate?: Date;
}

export interface PaymentStatusResponse {
  payments: any[];
}

export const PAYMENT_API = {

  INITIALIZE_PAYMENT: async (
    data: PaymentData
  ): Promise<CustomResponse<PaymentResponse>> => {
    try {
      const response = await POST(`${PaymentBaseURL}/initialize`, data);
      return response;
    } catch (error: any) {
      return error.response?.data || {
        error: true,
        message: error.message || "Failed to initialize payment"
      };
    }
  },

  VERIFY_PAYMENT: async (
    reference: string
  ): Promise<CustomResponse<PaymentVerificationResponse>> => {
    try {
      const response = await GET(`${PaymentBaseURL}/verify?reference=${reference}`);
      return response;
    } catch (error: any) {
      return error.response?.data || {
        error: true,
        message: error.message || "Failed to verify payment"
      };
    }
  },
};
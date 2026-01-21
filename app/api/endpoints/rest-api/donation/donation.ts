import { baseUrl } from "../../url";
import { POST, GET } from "@/app/api/lib/client";
import { CustomResponse } from "@/interfaces/response";

const DonationBaseURL = `${baseUrl}/donation`;

export interface DonationData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  amount: number;
  donationType: 'one-time' | 'recurring';
  purpose: 'general' | 'education' | 'community' | 'business' | 'infrastructure' | 'other';
  isRecurring?: boolean;
  recurrenceFrequency?: 'monthly' | 'quarterly' | 'annually';
  isAnonymous?: boolean;
  notes?: string;
  userId?: number;
}

export interface DonationPaymentResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface DonationVerificationResponse {
  reference: string;
  status: "success" | "failed" | "pending" | "abandoned";
  gatewayResponse: any;
  paymentDate?: Date;
  donation?: any;
}

export interface DonationResponse {
  donation: any;
  payment?: DonationPaymentResponse;
}

export interface DonationsResponse {
  donations: any[];
  total: number;
  totalPages: number;
}

export const DONATION_API = {
  
  CREATE_AND_PAY: async (data: DonationData): Promise<CustomResponse<DonationResponse>> => {
    try {
      const response = await POST(`${DonationBaseURL}/create-and-pay`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  CREATE_DONATION: async (data: DonationData): Promise<CustomResponse<any>> => {
    try {
      const response = await POST(`${DonationBaseURL}/create`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  INITIALIZE_PAYMENT: async (donationId: number): Promise<CustomResponse<DonationPaymentResponse>> => {
    try {
      const response = await POST(`${DonationBaseURL}/initialize-payment`, { donationId });
      return response;
    } catch (error) {
      throw error;
    }
  },

  VERIFY_PAYMENT: async (reference: string): Promise<CustomResponse<DonationVerificationResponse>> => {
    try {
      const response = await POST(`${DonationBaseURL}/verify`, { reference });
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_DONATION_BY_REFERENCE: async (reference: string): Promise<CustomResponse<any>> => {
    try {
      const response = await GET(`${DonationBaseURL}/reference/${reference}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_ALL_DONATIONS: async (
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: string;
      purpose?: string;
      startDate?: Date;
      endDate?: Date;
      isRecurring?: boolean;
    }
  ): Promise<CustomResponse<DonationsResponse>> => {
    try {
      let url = `${DonationBaseURL}?page=${page}&limit=${limit}`;
      
      if (filters?.status) url += `&status=${filters.status}`;
      if (filters?.purpose) url += `&purpose=${filters.purpose}`;
      if (filters?.startDate) url += `&startDate=${filters.startDate.toISOString()}`;
      if (filters?.endDate) url += `&endDate=${filters.endDate.toISOString()}`;
      if (filters?.isRecurring !== undefined) url += `&isRecurring=${filters.isRecurring}`;
      
      const response = await GET(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_USER_DONATIONS: async (userId: number): Promise<CustomResponse<any>> => {
    try {
      const response = await GET(`${DonationBaseURL}/user/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_EMAIL_DONATIONS: async (email: string): Promise<CustomResponse<any>> => {
    try {
      const response = await GET(`${DonationBaseURL}/email/${email}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_RECENT_DONATIONS: async (limit: number = 10): Promise<CustomResponse<any>> => {
    try {
      const response = await GET(`${DonationBaseURL}/recent?limit=${limit}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_DONATION_STATS: async (): Promise<CustomResponse<any>> => {
    try {
      const response = await GET(`${DonationBaseURL}/stats/summary`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  CANCEL_DONATION: async (reference: string): Promise<CustomResponse<any>> => {
    try {
      const response = await POST(`${DonationBaseURL}/cancel`, { reference });
      return response;
    } catch (error) {
      throw error;
    }
  },

  SEND_RECEIPT: async (donationId: number): Promise<CustomResponse<any>> => {
    try {
      const response = await POST(`${DonationBaseURL}/send-receipt`, { donationId });
      return response;
    } catch (error) {
      throw error;
    }
  },

  CHECK_PAYMENT_STATUS: async (reference: string): Promise<CustomResponse<any>> => {
    try {
      const response = await GET(`${DonationBaseURL}/reference/${reference}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
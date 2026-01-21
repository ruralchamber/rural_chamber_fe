import { baseUrl } from "../../url";
import { POST, GET } from "@/app/api/lib/client";
import { CustomResponse } from "@/interfaces/response";

const TripPaymentBaseURL = `${baseUrl}/trip-payment`;

export interface TripPaymentResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface TripPaymentVerificationResponse {
  reference: string;
  status: "success" | "failed" | "pending";
  gatewayResponse: any;
  paymentDate?: Date;
  booking?: any;
}

export const TRIP_PAYMENT_API = {
  INITIALIZE_PAYMENT: async (bookingId: number): Promise<CustomResponse<TripPaymentResponse>> => {
    try {
      const response = await POST(`${TripPaymentBaseURL}/initialize/${bookingId}`, {});
      return response;
    } catch (error) {
      throw error;
    }
  },

  VERIFY_PAYMENT: async (reference: string): Promise<CustomResponse<TripPaymentVerificationResponse>> => {
    try {
      const response = await POST(`${TripPaymentBaseURL}/verify`, { reference });
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_BOOKING_BY_ID: async (bookingId: number): Promise<CustomResponse<any>> => {
    try {
      const response = await GET(`${TripPaymentBaseURL}/booking/${bookingId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_BOOKING_BY_REFERENCE: async (reference: string): Promise<CustomResponse<any>> => {
    try {
      const response = await GET(`${TripPaymentBaseURL}/reference/${reference}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  CHECK_PAYMENT_STATUS: async (reference: string): Promise<CustomResponse<any>> => {
    try {
      const response = await GET(`${TripPaymentBaseURL}/reference/${reference}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
// src/app/api/endpoints/rest-api/subscriber/subscriber.ts
import { CustomResponse } from "@/interfaces/response";
import { baseUrl } from "../../url";
import { POST } from "@/app/api/lib/client";

export interface ISubscribeRequest {
  email: string;
  source?: string;
}

export interface ISubscribeResponse {
  success: boolean;
  message: string;
  isNew: boolean;
  subscriber?: {
    id: number;
    email: string;
    isActive: boolean;
    source?: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

const subscriptionBaseURL = `${baseUrl}/subscriber`;

export const SUBSCRIPTION_API = {
  SUBSCRIBE_EMAIL: async (data: ISubscribeRequest): Promise<CustomResponse<ISubscribeResponse>> => {
    try {
      const response = await POST(`${subscriptionBaseURL}/subscribe`, data);
      return response;
    } catch (err: any) {
      if (err.response?.data) {
        throw new Error(err.response.data.message || 'Failed to subscribe');
      }
      throw new Error(err.message || 'Network error occurred');
    }
  },
};
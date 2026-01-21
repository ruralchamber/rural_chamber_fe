import { CustomResponse } from "@/interfaces/response";
import { baseUrl } from "../../url";
import { POST } from "@/app/api/lib/client";

export interface IContactRequest {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  service?: string;
}

export interface IContactResponse {
  success: boolean;
  message: string;
}

const contactBaseURL = `${baseUrl}/contact`;

export const CONTACT_API = {
  SUBMIT_CONTACT: async (data: IContactRequest): Promise<CustomResponse<IContactResponse>> => {
    try {
      const response = await POST(`${contactBaseURL}`, data);
      return response;
    } catch (err: any) {
      if (err.response?.data) {
        throw new Error(err.response.data.message || 'Failed to submit contact form');
      }
      throw new Error(err.message || 'Network error occurred');
    }
  },
};
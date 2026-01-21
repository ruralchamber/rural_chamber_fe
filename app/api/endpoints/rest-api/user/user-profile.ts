import { CustomResponse } from "@/interfaces/response";
import { baseUrl } from "../../url";
import { GET, PUT, DELETE } from "@/app/api/lib/client";

const userBaseURL = `${baseUrl}/user`;

export interface IUserProfileData {
  createdAt: any;
  fullName: string;
  email: string;
  cellphone?: string;
  gender?: string;
  dateOfBirth?: Date;
  idNumber?: string;
  passport?: string;
  accountType?: "individual" | "organizational";
  
  country?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  suburb?: string;
  postalCode?: string;
  city?: string;
  district?: string;
  province?: string;

  companyName?: string;
  organizationType?: string;
  registrationNumber?: string;
  sector?: string;
  vatNumber?: string;
  website?: string;
  telephone?: string;
  
  membershipType?: string;
  membershipNumber?: string;
  membershipAmount?: number;
  billingFrequency?: "monthly" | "annual";
}

export interface IUpdateProfileRequest {
  fullName?: string;
  cellphone?: string;
  gender?: string;
  dateOfBirth?: Date;
  currentPassword?: string;
  newPassword?: string;
}

export const USER_PROFILE_API = {
 
  GET_PROFILE: async (): Promise<CustomResponse<IUserProfileData>> => {
    try {
      const response = await GET(`${userBaseURL}/profile`);
      return response;
    } catch (err: any) {
      if (err.response?.data) {
        throw new Error(err.response.data.message || 'Failed to get profile');
      }
      throw new Error(err.message || 'Network error occurred');
    }
  },

  
  UPDATE_PROFILE: async (data: IUpdateProfileRequest): Promise<CustomResponse<IUserProfileData>> => {
    try {
      const response = await PUT(`${userBaseURL}/profile`, data);
      return response;
    } catch (err: any) {
      if (err.response?.data) {
        throw new Error(err.response.data.message || 'Failed to update profile');
      }
      throw new Error(err.message || 'Network error occurred');
    }
  },


  DELETE_ACCOUNT: async (): Promise<CustomResponse<any>> => {
    try {
      const response = await DELETE(`${userBaseURL}/account`);
      return response;
    } catch (err: any) {
      if (err.response?.data) {
        throw new Error(err.response.data.message || 'Failed to delete account');
      }
      throw new Error(err.message || 'Network error occurred');
    }
  },
};
import { baseUrl } from "../../url";
import { POST } from "@/app/api/lib/client";
import { IUserLogin, IUserSignUp, TokenData } from "@/interfaces/auth";
import { CustomResponse } from "@/interfaces/response";

const AuthbaseURL = `${baseUrl}/auth`

export const AUTH_API = {
  SIGNUP_POST: async (userData: IUserSignUp): Promise<CustomResponse<TokenData>> => {
    try {
      const response = await POST(`${AuthbaseURL}/signup`, userData);
      return response;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: error.message || "Signup failed",
        error: true
      };
    }
  },
  
  LOGIN_POST: async (userData: IUserLogin): Promise<CustomResponse<TokenData>> => {
    try {
      const response = await POST(`${AuthbaseURL}/login`, userData);
      
      // Check if response indicates incomplete registration
      if (response.data?.needsToCompleteRegistration) {
        return {
          ...response,
          success: false,
          error: true,
          message: "Please complete your registration first."
        };
      }
      
      return response;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: error.message || "Login failed",
        error: true
      };
    }
  },
  
  CHECK_REGISTRATION_STATUS: async (email: string): Promise<CustomResponse<{
    canLogin: boolean;
    needsToCompleteRegistration?: boolean;
    resumeStep?: number;
    user?: any;
  }>> => {
    try {
      const response = await POST(`${AuthbaseURL}/check-registration`, { email });
      return response;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: error.message || "Failed to check registration status",
        error: true
      };
    }
  },

  SEND_OTP: async (data: any) => {
    try {
      const response = await POST(`${AuthbaseURL}/send-otp`, data);
      return response;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: error.message || "Failed to send OTP",
        error: true
      };
    }
  },
  
  VERIFY_OTP: async (data: any): Promise<CustomResponse<TokenData>> => {
    try {
      const response = await POST(`${AuthbaseURL}/verify-otp`, data);
      return response;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: error.message || "Failed to verify OTP",
        error: true
      };
    }
  },

  
  
  UPDATE_PASSWORD: async (data: any): Promise<CustomResponse<TokenData>> => {
    try {
      const response = await POST(`${AuthbaseURL}/update-password`, data);
      return response;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: error.message || "Failed to update password",
        error: true
      };
    }
  },

 CHECK_REGISTRATION: async (email: string): Promise<CustomResponse<{
    canLogin: boolean;
    needsToCompleteRegistration?: boolean;
    resumeStep?: number;
    user?: any;
  }>> => {
    try {
      const response = await POST(`${AuthbaseURL}/check-registration`, { email });
      return response;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: error.message || "Failed to check registration status",
        error: true
      };
    }
  },
};
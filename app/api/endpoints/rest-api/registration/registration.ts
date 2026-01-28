import { baseUrl } from "../../url";
import { POST, GET } from "@/app/api/lib/client";
import { CustomResponse } from "@/interfaces/response";
import { IUserSignUp, TokenData } from "@/interfaces/auth";
import { RegistrationData } from "@/components/registration/RegistrationWizard";

const RegistrationBaseURL = `${baseUrl}/registration`;

export interface StartRegistrationResponse {
  user: any;
  tokenData: TokenData;
  resumeStep?: number;       
  isNewUser: boolean;        
}

export interface RegistrationStepRequest {
  userId: number;
  stepNumber: number;
  stepData: any;
}

export interface VerificationStatusResponse {
  emailVerified: boolean;
  user?: any;
}

export interface CompleteRegistrationRequest {
  userId: number;
  finalData: RegistrationData;
}

export interface RegistrationProgressResponse {
  registration: any;
  steps: any[];
  currentStep: number;
  progress: number;
  isComplete: boolean;
}

export const REGISTRATION_API = {
  START_REGISTRATION: async (userData: IUserSignUp): Promise<CustomResponse<StartRegistrationResponse>> => {
    try {
      const response = await POST(`${RegistrationBaseURL}/start`, userData);
      return response;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: error.message || "Registration failed",
        error: true
      };
    }
  },

  SAVE_STEP: async (data: RegistrationStepRequest): Promise<CustomResponse<any>> => {
    try {
      const response = await POST(`${RegistrationBaseURL}/step`, data);
      return response;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: error.message || "Failed to save step",
        error: true
      };
    }
  },

  COMPLETE_REGISTRATION: async (data: CompleteRegistrationRequest): Promise<CustomResponse<any>> => {
    try {
      const response = await POST(`${RegistrationBaseURL}/complete`, data);
      return response;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: error.message || "Failed to complete registration",
        error: true
      };
    }
  },

  GET_PROGRESS: async (userId: number): Promise<CustomResponse<RegistrationProgressResponse>> => {
    try {
      const response = await GET(`${RegistrationBaseURL}/progress/${userId}`);
      return response;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: error.message || "Failed to get registration progress",
        error: true
      };
    }
  },

  VERIFY_EMAIL: async (token: string): Promise<CustomResponse<any>> => {
    try {
      const response = await POST(`${RegistrationBaseURL}/verify-email`, { token });
      return response;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: error.message || "Failed to verify email",
        error: true
      };
    }
  },

  RESEND_VERIFICATION: async (email: string): Promise<CustomResponse<any>> => {
    try {
      const response = await POST(`${RegistrationBaseURL}/resend-verification`, { email });
      return response;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: error.message || "Failed to resend verification email",
        error: true
      };
    }
  },

  CHECK_VERIFICATION_STATUS: async (email: string): Promise<CustomResponse<VerificationStatusResponse>> => {
    try {
      const response = await POST(`${RegistrationBaseURL}/check-status`, { email });
      return response;
    } catch (error: any) {
      return error.response?.data || {
        success: false,
        message: error.message || "Failed to check verification status",
        error: true
      };
    }
  },
  
  CHECK_REGISTRATION_COMPLETE: async (email: string): Promise<CustomResponse<{
    canLogin: boolean;
    needsToCompleteRegistration?: boolean;
    resumeStep?: number;
    user?: any;
  }>> => {
    try {
      const response = await POST(`${baseUrl}/auth/check-registration`, { email });
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
import { baseUrl } from "../../url";
import { POST, GET } from "@/app/api/lib/client";
import { CustomResponse } from "@/interfaces/response";
import { IUserSignUp, TokenData } from "@/interfaces/auth";
import { RegistrationData } from "@/components/registration/RegistrationWizard";

const RegistrationBaseURL = `${baseUrl}/registration`;

export interface StartRegistrationResponse {
  registration: any;
  user: any;
  tokenData: TokenData;
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
  // Start registration process
  START_REGISTRATION: async (userData: IUserSignUp): Promise<CustomResponse<StartRegistrationResponse>> => {
    try {
      const response = await POST(`${RegistrationBaseURL}/start`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Save registration step
  SAVE_STEP: async (data: RegistrationStepRequest): Promise<CustomResponse<any>> => {
    try {
      const response = await POST(`${RegistrationBaseURL}/step`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Complete registration
  COMPLETE_REGISTRATION: async (data: CompleteRegistrationRequest): Promise<CustomResponse<any>> => {
    try {
      const response = await POST(`${RegistrationBaseURL}/complete`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get registration progress
  GET_PROGRESS: async (userId: number): Promise<CustomResponse<RegistrationProgressResponse>> => {
    try {
      const response = await GET(`${RegistrationBaseURL}/progress/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Verify email
  VERIFY_EMAIL: async (token: string): Promise<CustomResponse<any>> => {
    try {
      const response = await POST(`${RegistrationBaseURL}/verify-email`, { token });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Resend verification email
  RESEND_VERIFICATION: async (email: string): Promise<CustomResponse<any>> => {
    try {
      const response = await POST(`${RegistrationBaseURL}/resend-verification`, { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Check verification status - ADD THIS
  CHECK_VERIFICATION_STATUS: async (email: string): Promise<CustomResponse<VerificationStatusResponse>> => {
    try {
      const response = await POST(`${RegistrationBaseURL}/check-status`, { email });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
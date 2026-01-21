import { baseUrl } from "../../url";
import { POST } from "@/app/api/lib/client";
import { IUserLogin, IUserSignUp, TokenData } from "@/interfaces/auth";
import { CustomResponse } from "@/interfaces/response";

const AuthbaseURL = `${baseUrl}/auth`

export const AUTH_API = {

    SIGNUP_POST: async (userData: IUserSignUp): Promise<CustomResponse<TokenData>> => {
    const response = await POST(`${AuthbaseURL}/signup`, userData);
    return response;
  },
  
  LOGIN_POST: async (userData: IUserLogin): Promise<CustomResponse<TokenData>> => {
    const response = await POST(`${AuthbaseURL}/login`, userData);
    return response;
  },

  SEND_OTP: async (data: any) => {
    try {
      const response = await POST(`${AuthbaseURL}/send-otp`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }
  ,
  VERIFY_OTP: async (data: any): Promise<CustomResponse<TokenData>> => {
    try {
      const response = await POST(`${AuthbaseURL}/verify-otp`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  UPDATE_PASSWORD: async (data: any): Promise<CustomResponse<TokenData>> => {
    try {
      const response = await POST(`${AuthbaseURL}/update-password`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
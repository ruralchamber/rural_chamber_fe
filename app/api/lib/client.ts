import { Diagnostic } from "./logger";
import axios from "axios";
import { authUtils } from "./auth-utils";

function getHeaders() {
  const token = authUtils.getAccessToken();
  
  const headers: any = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export async function GET(endPoint: string) {
  try {
    const response = await axios.get(endPoint, {
      headers: getHeaders(),
      withCredentials: true,
      decompress: true,
      responseType: 'json'
    });
    return response.data;
  } catch (error: any) {
    console.error(`[API ERROR: GET ${endPoint}]`, error.message);
    
    if (error.response?.status === 401) {
      authUtils.clearAuthData();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    throw error;
  }
}

export async function POST(endPoint: string, payload: object) {
  try {
    const result = await axios.post(endPoint, payload, {
      headers: getHeaders(),
      withCredentials: true
    });
    Diagnostic("SUCCESS ON POST, returning", result);
    return result.data;
  } catch (error: any) {
    console.log(`[API ERROR: Method: POST; Endpoint: ${endPoint}]`, error);
    Diagnostic("ERROR ON POST, returning", error);
    
    if (error.response?.status === 401) {
      authUtils.clearAuthData();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    throw error;
  }
}

export async function PUT(endPoint: string, payload?: object): Promise<any> {
  try {
    const result = await axios.put(endPoint, payload, { 
      headers: getHeaders(),
      withCredentials: true
    });
    return result.data;
  } catch (error: any) {
    console.error(`[API ERROR: PUT ${endPoint}]`, error.message);
    
    if (error.response?.status === 401) {
      authUtils.clearAuthData();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    throw error;
  }
}

export async function PATCH(endPoint: string, payload?: object): Promise<any> {
  try {
    const result = await axios.patch(endPoint, payload, { 
      headers: getHeaders(),
      withCredentials: true
    });
    return result.data;
  } catch (error: any) {
    console.error(`[API ERROR: PATCH ${endPoint}]`, error.message);
    
    if (error.response?.status === 401) {
      authUtils.clearAuthData();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    throw error;
  }
}

export async function DELETE(endPoint: string, payload?: object): Promise<any> {
  try {
    const response = await axios.delete(endPoint, { 
      headers: getHeaders(),
      withCredentials: true,
      data: payload
    });
    return response.data;
  } catch (error: any) {
    console.error(`[API ERROR: DELETE ${endPoint}]`, error.message);
    
    if (error.response?.status === 401) {
      authUtils.clearAuthData();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    throw error;
  }
}
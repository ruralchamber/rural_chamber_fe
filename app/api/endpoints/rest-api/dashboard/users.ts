// src/app/api/endpoints/rest-api/dashboard/users.ts
import { baseUrl } from "../../url";
import { GET } from "@/app/api/lib/client";
import { CustomResponse } from "@/interfaces/response";

const AdminUsersBaseURL = `${baseUrl}/dashboard/users`;

export interface UserFilters {
  page?: number;
  limit?: number;
  subscriptionTier?: string;
  emailVerified?: string;
  search?: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  cellphone?: string;
  subscriptionTier: string;
  subscriptionStatus?: string;
  accountType?: string;
  emailVerified: boolean;
  registrationCompleted?: boolean;
  registrationDate: string;
  lastLogin?: string | null;
  membershipNumber?: string;
  subscriptionAmount?: number;
  registration?: {
    membershipNumber?: string;
    accountType?: string;
    firstName?: string;
    lastName?: string;
    membershipType?: string;
    isComplete?: boolean;
    idNumber?: string;
    passport?: string;
    dateOfBirth?: string;
    gender?: string;
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    suburb?: string;
    city?: string;
    province?: string;
    country?: string;
    postalCode?: string;
    companyName?: string;
    registrationNumber?: string;
    sector?: string;
    vatNumber?: string;
    billingFrequency?: string;
    membershipAmount?: number;
  };
  subscription?: {
    id: number;
    subscriptionType: string;
    status: string;
    amount: string;
    billingFrequency: string;
    nextBillingDate?: string;
    currentPeriodEnd?: string;
    startDate?: string;
    createdAt?: string;
    paymentMethod?: string;
    cardBrand?: string;
    cardLastFour?: string;
  };
}

export interface UsersResponse {
  total: number;
  totalPages: number;
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UserStats {
  totals: {
    totalUsers: number;
    verifiedUsers: number;
    completedRegistrations: number;
    activeSubscriptions: number;
  };
  breakdowns: {
    bySubscriptionTier: Array<{ tier: string; count: number }>;
    byRole: Array<{ role: string; count: number }>;
  };
  recentUsers: Array<{
    id: number;
    fullName: string;
    email: string;
    subscriptionTier: string;
    emailVerified: boolean;
    registrationCompleted: boolean;
    registrationDate: string;
    membershipNumber?: string;
  }>;
  upcomingRenewals: Array<{
    userId: number;
    userName: string;
    userEmail: string;
    subscriptionType: string;
    amount: number;
    nextBillingDate: string;
    daysUntilRenewal: number;
  }>;
}

export const ADMIN_USERS_API = {
  GET_ALL_USERS: async (filters?: UserFilters): Promise<CustomResponse<UsersResponse>> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      if (filters?.subscriptionTier) queryParams.append('subscriptionTier', filters.subscriptionTier);
      if (filters?.emailVerified) queryParams.append('emailVerified', filters.emailVerified);
      if (filters?.search) queryParams.append('search', filters.search);
      
      const url = queryParams.toString() 
        ? `${AdminUsersBaseURL}?${queryParams.toString()}`
        : AdminUsersBaseURL;
      
      const response = await GET(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_USER_STATS: async (): Promise<CustomResponse<UserStats>> => {
    try {
      const response = await GET(`${AdminUsersBaseURL}/stats`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_USER_DETAILS: async (userId: number): Promise<CustomResponse<User>> => {
    try {
      const response = await GET(`${AdminUsersBaseURL}/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
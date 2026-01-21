// app/api/endpoints/rest-api/dashboard/dashboard.ts
import { baseUrl } from "../../url";
import { GET } from "@/app/api/lib/client";
import { CustomResponse } from "@/interfaces/response";

const DashboardBaseURL = `${baseUrl}/dashboard`;

export interface DashboardStats {
  donations: {
    totalDonations: number;
    totalAmount: number;
    oneTimeDonations: number;
    recurringDonations: number;
    donationsByPurpose: Array<{
      purpose: string;
      count: number;
      totalAmount: number;
    }>;
  };
  registrations: {
    totalRegistrations: number;
    totalUsers: number;
    verifiedUsers: number;
    completedRegistrations: number;
    thisMonth: number;
    thisYear: number;
    membershipTypes: Array<{
      type: string;
      count: number;
    }>;
    accountTypes: Array<{
      type: string;
      count: number;
    }>;
  };
  subscribers: {
    totalSubscribers: number;
    thisMonth: number;
    thisYear: number;
    sources: Array<{
      source: string;
      count: number;
    }>;
  };
  events: {
    totalEvents: number;
    upcomingEvents: number;
    thisMonth: number;
    thisYear: number;
  };
  overview: {
    totalRevenue: number;
    totalMembers: number;
    totalSubscribers: number;
    activeEvents: number;
  };
}

export const DASHBOARD_API = {
  GET_DASHBOARD_STATS: async (): Promise<CustomResponse<DashboardStats>> => {
    try {
      const response = await GET(`${DashboardBaseURL}/stats`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
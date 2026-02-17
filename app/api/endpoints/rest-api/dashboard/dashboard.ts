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
  trips: {
    totalTrips: number;
    totalRevenue: number;
  };
  users: {
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
      createdAt: string;
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
  };
  overview: {
    totalRevenue: number;
    totalMembers: number;
    totalSubscribers: number;
    activeEvents: number;
    activeSubscriptions: number;
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
  },
};
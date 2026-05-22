import { GET, POST, PUT } from "@/app/api/lib/client";
import { baseUrl } from "../../url"; 

const SubscriptionBaseURL = `${baseUrl}/subscription`;
const SubscriptionPlanBaseURL = `${baseUrl}/subscription-plans`;

export interface SubscriptionData {
  userId?: number;
  registrationId: number;
  subscriptionType: SubscriptionType;
  billingFrequency: "monthly" | "annual";
  amount: number;
}

export type SubscriptionType = 
  | "free"
  | "individual_silver"
  | "individual_gold"
  | "individual_platinum"
  | "organizational_silver"
  | "organizational_gold"
  | "organizational_platinum";

export interface UpdateSubscriptionPlanRequest {
  newSubscriptionType: SubscriptionType;
  newBillingFrequency: "monthly" | "annual";
}

export interface PauseSubscriptionRequest {
  resumeDate?: string;
}

export interface CancelSubscriptionRequest {
  reason?: string;
}

export interface SubscriptionPaymentData {
  email: string;
  firstName: string;
  lastName: string;
  subscriptionType: SubscriptionType;
  billingFrequency: "monthly" | "annual";
  amount: number;
  registrationId: number;
}

export const SUBSCRIPTION_API = {
  GET_AVAILABLE_PLANS: async () => {
    try {
      const response = await GET(`${SubscriptionBaseURL}/plans`);
      return response;
    } catch (error: any) {
      return error.response?.data || {
        error: true,
        message: error.message || "Failed to fetch subscription plans"
      };
    }
  },

  GET_SUBSCRIPTION_PLANS: async () => {
    try {
      const response = await GET(`${SubscriptionPlanBaseURL}/`);
      return response;
    } catch (error: any) {
      return error.response?.data || {
        error: true,
        message: error.message || "Failed to fetch subscription plans"
      };
    }
  },

  CREATE_SUBSCRIPTION: async (subscriptionData: SubscriptionData) => {
    try {
      const response = await POST(`${SubscriptionBaseURL}/create`, subscriptionData);
      return response;
    } catch (error: any) {
      return error.response?.data || {
        error: true,
        message: error.message || "Failed to create subscription"
      };
    }
  },

  GET_SUBSCRIPTION: async () => {
    try {
      const response = await GET(`${SubscriptionBaseURL}/my-subscription`);
      
      if (!response) {
        throw new Error('No response from server');
      }
      
      if (response.data === null || (response.error && response.message?.includes('No active subscription'))) {
        return await SUBSCRIPTION_API.GET_MEMBERSHIP_FROM_PROFILE();
      }

      return response;
    } catch (error: any) {
      return error.response?.data || {
        error: true,
        message: error.message || "Failed to fetch subscription"
      };
    }
  },

  GET_MEMBERSHIP_FROM_PROFILE: async () => {
    try {
      const { USER_PROFILE_API } = await import('@/app/api/endpoints/rest-api/user/user-profile');
      const profileResponse = await USER_PROFILE_API.GET_PROFILE();
      
      if (profileResponse.error) {
        return { 
          error: true, 
          message: profileResponse.message || 'Failed to load profile',
          data: null 
        };
      }
      
      if (profileResponse.data && profileResponse.data.membershipType) {
        const subscriptionFromProfile = {
          subscriptionType: profileResponse.data.membershipType,
          billingFrequency: profileResponse.data.billingFrequency || 'annual',
          amount: profileResponse.data.membershipAmount || 0,
          status: 'active',
          startDate: profileResponse.data.createdAt || new Date().toISOString(),
          nextBillingDate: calculateNextBillingDate(
            profileResponse.data.createdAt || new Date().toISOString(),
            profileResponse.data.billingFrequency || 'annual'
          ),
          membershipNumber: profileResponse.data.membershipNumber,
          _source: 'profile' 
        };
        
        return {
          error: false,
          data: subscriptionFromProfile,
          message: 'Membership loaded from registration data'
        };
      }
      
      return {
        error: true,
        message: 'No membership found in profile',
        data: null
      };
      
    } catch (error: any) {
      return error.response?.data || {
        error: true,
        message: error.message || "Failed to fetch membership from profile"
      };
    }
  },

  UPDATE_SUBSCRIPTION_PLAN: async (request: UpdateSubscriptionPlanRequest) => {
    try {
      const response = await PUT(`${SubscriptionBaseURL}/update-plan`, request);
      return response;
    } catch (error: any) {
      return error.response?.data || {
        error: true,
        message: error.message || "Failed to update subscription plan"
      };
    }
  },

  PAUSE_SUBSCRIPTION: async (request?: PauseSubscriptionRequest) => {
    try {
      const response = await POST(`${SubscriptionBaseURL}/pause`, request || {});
      return response;
    } catch (error: any) {
      return error.response?.data || {
        error: true,
        message: error.message || "Failed to pause subscription"
      };
    }
  },

  RESUME_SUBSCRIPTION: async () => {
    try {
      const response = await POST(`${SubscriptionBaseURL}/resume`, {});
      return response;
    } catch (error: any) {
      return error.response?.data || {
        error: true,
        message: error.message || "Failed to resume subscription"
      };
    }
  },

  CANCEL_SUBSCRIPTION: async (request?: CancelSubscriptionRequest) => {
    try {
      const response = await POST(`${SubscriptionBaseURL}/cancel`, request || {});
      return response;
    } catch (error: any) {
      return error.response?.data || {
        error: true,
        message: error.message || "Failed to cancel subscription"
      };
    }
  },
};

function calculateNextBillingDate(startDate: string, frequency: string): string {
  if (!startDate) return '';
  
  try {
    const start = new Date(startDate);
    const next = new Date(start);
    
    if (frequency === 'monthly') {
      next.setMonth(next.getMonth() + 1);
    } else {
      next.setFullYear(next.getFullYear() + 1);
    }
    
    return next.toISOString();
  } catch (error) {
    console.error('Error calculating next billing date:', error);
    return '';
  }
}
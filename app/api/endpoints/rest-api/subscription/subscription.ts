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
      
      if (response.error) {
        console.error('❌ [Subscription API] Error fetching plans:', response.message);
      } else {
        console.log('✅ [Subscription API] Plans fetched successfully:', response.data?.length || 0, 'plans');
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ [Subscription API] Exception fetching plans:', error.message);
      return { error: true, message: error.message };
    }
  },

  GET_SUBSCRIPTION_PLANS: async () => {
    try {
      const response = await GET(`${SubscriptionPlanBaseURL}/`);
      
      if (response.error) {
        console.error('❌ [Subscription API] Error fetching plans:', response.message);
      } else {
        console.log('✅ [Subscription API] Plans fetched successfully:', response.data?.length || 0, 'plans');
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ [Subscription API] Exception fetching plans:', error.message);
      return { error: true, message: error.message };
    }
  },

  CREATE_SUBSCRIPTION: async (subscriptionData: SubscriptionData) => {
    try {
      console.log('📝 [Subscription API] Creating subscription:', subscriptionData);
      console.log('📝 [Subscription API] URL:', `${SubscriptionBaseURL}/create`);
      
      const response = await POST(`${SubscriptionBaseURL}/create`, subscriptionData);
      
      if (response.error) {
        console.error('❌ [Subscription API] Error creating subscription:', response.message);
        throw new Error(response.message || 'Failed to create subscription');
      }

      console.log('✅ [Subscription API] Subscription created successfully:', response.data);
      return response;
    } catch (error: any) {
      console.error('❌ [Subscription API] Exception creating subscription:', error.message);
      return { error: true, message: error.message };
    }
  },

  GET_SUBSCRIPTION: async () => {
    try {
      console.log('🔍 [Subscription API] Getting user subscription');
      console.log('🔍 [Subscription API] URL:', `${SubscriptionBaseURL}/my-subscription`);
      
      const response = await GET(`${SubscriptionBaseURL}/my-subscription`);
      
      console.log('📥 [Subscription API] Response:', {
        success: !response.error,
        hasData: !!response.data,
        message: response.message
      });
      
      if (!response) {
        throw new Error('No response from server');
      }

      
      if (response.data === null || (response.error && response.message?.includes('No active subscription'))) {
        console.log('ℹ️ [Subscription API] No subscription in table, checking user profile...');
        return await SUBSCRIPTION_API.GET_MEMBERSHIP_FROM_PROFILE();
      }

      return response;
    } catch (error: any) {
      console.error('❌ [Subscription API] Exception fetching subscription:', error.message);
      return { error: true, message: error.message };
    }
  },

  GET_MEMBERSHIP_FROM_PROFILE: async () => {
    try {
      console.log('📡 [Subscription API] Fetching membership info from user profile...');
      
      const { USER_PROFILE_API } = await import('@/app/api/endpoints/rest-api/user/user-profile');
      const profileResponse = await USER_PROFILE_API.GET_PROFILE();
      
      console.log('📥 [Subscription API] Profile response:', {
        hasData: !!profileResponse.data,
        membershipType: profileResponse.data?.membershipType,
        error: profileResponse.error
      });
      
      if (profileResponse.error) {
        console.log('❌ [Subscription API] Failed to fetch profile:', profileResponse.message);
        return { 
          error: true, 
          message: profileResponse.message || 'Failed to load profile',
          data: null 
        };
      }
      
      if (profileResponse.data && profileResponse.data.membershipType) {
        console.log('✅ [Subscription API] Membership found in profile:', profileResponse.data.membershipType);
        
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
      
      console.log('ℹ️ [Subscription API] No membership information found in profile');
      return {
        error: true,
        message: 'No membership found in profile',
        data: null
      };
      
    } catch (error: any) {
      console.error('❌ [Subscription API] Exception fetching membership from profile:', error.message);
      return { error: true, message: error.message };
    }
  },

  UPDATE_SUBSCRIPTION_PLAN: async (request: UpdateSubscriptionPlanRequest) => {
    try {
      console.log('🔄 [Subscription API] Updating subscription plan:', request);
      console.log('🔄 [Subscription API] URL:', `${SubscriptionBaseURL}/update-plan`);
      
      const response = await PUT(`${SubscriptionBaseURL}/update-plan`, request);
      
      if (response.error) {
        console.error('❌ [Subscription API] Error updating plan:', response.message);
        throw new Error(response.message || 'Failed to update subscription plan');
      }

      console.log('✅ [Subscription API] Plan updated successfully:', response.data);
      return response;
    } catch (error: any) {
      console.error('❌ [Subscription API] Exception updating plan:', error.message);
      return { error: true, message: error.message };
    }
  },

  PAUSE_SUBSCRIPTION: async (request?: PauseSubscriptionRequest) => {
    try {
      console.log('⏸️ [Subscription API] Pausing subscription:', request);
      console.log('⏸️ [Subscription API] URL:', `${SubscriptionBaseURL}/pause`);
      
      const response = await POST(`${SubscriptionBaseURL}/pause`, request || {});
      
      if (response.error) {
        console.error('❌ [Subscription API] Error pausing subscription:', response.message);
        throw new Error(response.message || 'Failed to pause subscription');
      }

      console.log('✅ [Subscription API] Subscription paused successfully:', response.data);
      return response;
    } catch (error: any) {
      console.error('❌ [Subscription API] Exception pausing subscription:', error.message);
      return { error: true, message: error.message };
    }
  },

  RESUME_SUBSCRIPTION: async () => {
    try {
      console.log('▶️ [Subscription API] Resuming subscription');
      console.log('▶️ [Subscription API] URL:', `${SubscriptionBaseURL}/resume`);
      
      const response = await POST(`${SubscriptionBaseURL}/resume`, {});
      
      if (response.error) {
        console.error('❌ [Subscription API] Error resuming subscription:', response.message);
        throw new Error(response.message || 'Failed to resume subscription');
      }

      console.log('✅ [Subscription API] Subscription resumed successfully:', response.data);
      return response;
    } catch (error: any) {
      console.error('❌ [Subscription API] Exception resuming subscription:', error.message);
      return { error: true, message: error.message };
    }
  },

  CANCEL_SUBSCRIPTION: async (request?: CancelSubscriptionRequest) => {
    try {
      console.log('❌ [Subscription API] Cancelling subscription:', request);
      console.log('❌ [Subscription API] URL:', `${SubscriptionBaseURL}/cancel`);
      
      const response = await POST(`${SubscriptionBaseURL}/cancel`, request || {});
      
      if (response.error) {
        console.error('❌ [Subscription API] Error cancelling subscription:', response.message);
        throw new Error(response.message || 'Failed to cancel subscription');
      }

      console.log('✅ [Subscription API] Subscription cancelled successfully:', response.data);
      return response;
    } catch (error: any) {
      console.error('❌ [Subscription API] Exception cancelling subscription:', error.message);
      return { error: true, message: error.message };
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
    console.error('❌ [Subscription API] Error calculating next billing date:', error);
    return '';
  }
}
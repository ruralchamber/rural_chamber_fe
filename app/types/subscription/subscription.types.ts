// app/types/subscription/subscription.types.ts

export interface SubscriptionData {
  userId?: number;
  registrationId: number;
  subscriptionType: SubscriptionType;
  billingFrequency: "monthly" | "annual";
  amount: number;
  billedTo: string;
  country: string;
  postalCode: string;
  paymentMethod?: "credit_card" | "debit_card";
  cardLastFour?: string;
  cardBrand?: string;
  cardExpiryMonth?: number;
  cardExpiryYear?: number;
}

export interface CreateSubscriptionRequest {
  registrationId: number;
  subscriptionType: SubscriptionType;
  billingFrequency: "monthly" | "annual";
  paymentDetails: {
    paymentMethod: "credit_card" | "debit_card";
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    billedTo: string;
    country: string;
    postalCode: string;
  };
}

export type SubscriptionType = 
  | "free"
  | "individual_silver"
  | "individual_gold"
  | "individual_platinum"
  | "organizational_silver"
  | "organizational_gold"
  | "organizational_platinum";

export type SubscriptionStatus = "active" | "cancelled" | "paused" | "expired";

export interface UpdateSubscriptionPlanRequest {
  newSubscriptionType: SubscriptionType;
  newBillingFrequency: "monthly" | "annual";
}

export interface UpdatePaymentMethodRequest {
  paymentMethod: "credit_card" | "debit_card";
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billedTo: string;
  country: string;
  postalCode: string;
}

export interface PauseSubscriptionRequest {
  resumeDate?: string;
}

export interface CancelSubscriptionRequest {
  reason?: string;
}

export interface SubscriptionPlan {
  type: SubscriptionType;
  name: string;
  monthlyAmount: number;
  annualAmount: number;
  features: string[];
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionType, SubscriptionPlan> = {
  free: {
    type: "free",
    name: "Free Membership",
    monthlyAmount: 0,
    annualAmount: 0,
    features: ["Access to Industry-Specific Content", "Limited Networking Opportunities"]
  },
  individual_silver: {
    type: "individual_silver",
    name: "Individual Silver",
    monthlyAmount: 46,
    annualAmount: 500,
    features: [
      "Networking Sessions/Stream",
      "Access to Monthly Events",
      "Business Planning & Advisory",
      "Business Finance Support Assistance",
      "Association Affiliation"
    ]
  },
  individual_gold: {
    type: "individual_gold",
    name: "Individual Gold",
    monthlyAmount: 115,
    annualAmount: 1250,
    features: [
      "All Silver features",
      "Ohakaza Membership benefits",
      "Goats farming study guides",
      "Access to online practicals",
      "Member card",
      "Enhanced networking opportunities"
    ]
  },
  individual_platinum: {
    type: "individual_platinum",
    name: "Individual Platinum",
    monthlyAmount: 230,
    annualAmount: 2500,
    features: [
      "All Gold features",
      "Access to exclusive events",
      "International conferences",
      "Travel opportunities",
      "Meet global investors"
    ]
  },
  organizational_silver: {
    type: "organizational_silver",
    name: "Organizational Silver",
    monthlyAmount: 230,
    annualAmount: 2500,
    features: [
      "Networking Sessions/Stream",
      "Access to Monthly Events",
      "Business Planning & Advisory",
      "Business Finance Support Assistance",
      "Association Affiliation"
    ]
  },
  organizational_gold: {
    type: "organizational_gold",
    name: "Organizational Gold",
    monthlyAmount: 350,
    annualAmount: 3500,
    features: [
      "All Silver features",
      "Ohakaza Membership benefits",
      "Enhanced networking opportunities",
      "Priority support"
    ]
  },
  organizational_platinum: {
    type: "organizational_platinum",
    name: "Organizational Platinum",
    monthlyAmount: 460,
    annualAmount: 5000,
    features: [
      "All Gold features",
      "Exclusive organizational events",
      "International business trips",
      "VIP support"
    ]
  }
};
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { SUBSCRIPTION_API } from '@/app/api/endpoints/rest-api/subscription/subscription';
import { Loader2 } from 'lucide-react';

interface MembershipSelectionData {
  accountType: "individual" | "organizational";
  membershipType: string;
  membershipAmount: number;
  billingFrequency: "monthly" | "annual";
}

interface MembershipSelectionStepProps {
  data: any;
  onNext: (data: MembershipSelectionData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

interface PlanFromAPI {
  id: string;
  name: string;
  description: string;
  accountType: string;
  membershipType: string;
  monthlyAmount: number;
  annualAmount: number;
  features: string[];
  planCode: string;
  isActive: boolean;
}

interface DisplayPlan {
  type: string;
  title: string;
  description: string;
  monthlyAmount: number;
  annualAmount: number;
  annualPrice: string;
  monthlyPrice: string;
  planCode?: string;
  features?: string[];
}

// Free plan - keep it hardcoded as you mentioned
const FREE_PLAN: DisplayPlan = {
  type: "free",
  title: "Free Membership",
  description: "Get started with basic community access",
  monthlyAmount: 0,
  annualAmount: 0,
  annualPrice: "R0/year",
  monthlyPrice: "R0/month",
  features: []
};

// Format currency helper function - moved to the top
const formatCurrency = (amount: number, period: 'month' | 'year'): string => {
  if (amount === 0) return `R0/${period}`;

  const formattedAmount = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${formattedAmount}/${period}`;
};

export const MembershipSelectionStep = ({
  data,
  onNext,
  onBack,
  isLoading = false,
}: MembershipSelectionStepProps) => {
  const [selectedMembership, setSelectedMembership] = useState(data.membershipType || "");
  const [billingFrequency, setBillingFrequency] = useState<"monthly" | "annual">(
    data.billingFrequency || "annual"
  );
  const [plans, setPlans] = useState<PlanFromAPI[]>([]);
  const [isFetchingPlans, setIsFetchingPlans] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accountType = data.accountType || "individual";

  useEffect(() => {
    fetchPlans();
  }, [accountType]);

  const fetchPlans = async () => {
    try {
      setIsFetchingPlans(true);
      setError(null);

      const response = await SUBSCRIPTION_API.GET_SUBSCRIPTION_PLANS();

      if (response.error) {
        throw new Error(response.message || 'Failed to load plans');
      }

      // Access the data correctly - response.data.data contains the actual plans
      const apiData = response.data?.data || response.data;

      if (!apiData) {
        throw new Error('No plan data received from server');
      }

      // Get plans based on account type
      const apiPlans = accountType === "individual"
        ? apiData.individual || []
        : apiData.organizational || [];

      setPlans(apiPlans);
    } catch (err: any) {
      console.error('❌ [MembershipSelectionStep] Error fetching plans:', err);
      setError(err.message || 'Failed to load membership plans. Please try again.');
    } finally {
      setIsFetchingPlans(false);
    }
  };

  // Combine free plan with API plans
  const currentMemberships: DisplayPlan[] = [
    FREE_PLAN,
    ...plans.map(plan => ({
      type: plan.membershipType,
      title: plan.name,
      description: plan.description,
      monthlyAmount: plan.monthlyAmount,
      annualAmount: plan.annualAmount,
      annualPrice: formatCurrency(plan.annualAmount, 'year'),
      monthlyPrice: formatCurrency(plan.monthlyAmount, 'month'),
      planCode: plan.planCode,
      features: plan.features
    }))
  ];

  const selectedPlan = currentMemberships.find(plan => plan.type === selectedMembership);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlan) {
      alert('Please select a membership plan');
      return;
    }

    const membershipData: MembershipSelectionData = {
      accountType,
      membershipType: selectedMembership,
      membershipAmount: billingFrequency === "monthly"
        ? selectedPlan.monthlyAmount
        : selectedPlan.annualAmount,
      billingFrequency,
    };

    onNext(membershipData);
  };

  if (isFetchingPlans) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Membership</h2>
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading membership plans...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Membership</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">
            <p className="font-semibold">Error loading plans</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={fetchPlans}
            className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Membership</h2>
      <p className="text-gray-500 text-sm mb-6">
        Select your membership plan and billing frequency
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Billing Frequency */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Billing Frequency</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className={`flex items-center space-x-2 border rounded-lg p-4 hover:bg-white cursor-pointer ${billingFrequency === "annual" ? "bg-white border-[#9FC93B] shadow-sm" : "border-gray-300"
              }`}>
              <input
                type="radio"
                name="billingFrequency"
                value="annual"
                checked={billingFrequency === "annual"}
                onChange={(e) => setBillingFrequency(e.target.value as "annual")}
                className="text-[#9FC93B] focus:ring-[#9FC93B]"
              />
              <div>
                <span className="font-medium">Annual Billing</span>
                <p className="text-sm text-gray-500">Pay once per year</p>
              </div>
            </label>
            <label className={`flex items-center space-x-2 border rounded-lg p-4 hover:bg-white cursor-pointer ${billingFrequency === "monthly" ? "bg-white border-[#9FC93B] shadow-sm" : "border-gray-300"
              }`}>
              <input
                type="radio"
                name="billingFrequency"
                value="monthly"
                checked={billingFrequency === "monthly"}
                onChange={(e) => setBillingFrequency(e.target.value as "monthly")}
                className="text-[#9FC93B] focus:ring-[#9FC93B]"
              />
              <div>
                <span className="font-medium">Monthly Billing</span>
                <p className="text-sm text-gray-500">Pay monthly</p>
              </div>
            </label>
          </div>
        </div>

        {/* Membership Plans */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            {accountType === "individual" ? "Individual" : "Organizational"} Membership Plans
          </h3>
          {currentMemberships.length === 1 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">No paid plans available for {accountType} accounts. Please contact support.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentMemberships.map((plan) => (
                <label
                  key={plan.type}
                  className={`block border rounded-lg p-4 cursor-pointer transition-all ${selectedMembership === plan.type
                      ? "border-[#9FC93B] bg-green-50 shadow-sm"
                      : "border-gray-300 hover:border-gray-400"
                    }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="membership"
                      value={plan.type}
                      checked={selectedMembership === plan.type}
                      onChange={(e) => setSelectedMembership(e.target.value)}
                      className="mt-1 text-[#9FC93B] focus:ring-[#9FC93B]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900">{plan.title}</span>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            {billingFrequency === "annual" ? plan.annualPrice : plan.monthlyPrice}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{plan.description}</p>

                      {plan.features && plan.features.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-500 mb-1">Includes:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {plan.features.slice(0, 3).map((feature: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="text-[#9FC93B] mr-1">✓</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                            {plan.features.length > 3 && (
                              <li className="text-gray-400">+ {plan.features.length - 3} more benefits</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Selected Plan Summary */}
        {selectedPlan && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Selected Plan</h4>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{selectedPlan.title}</p>
                <p className="text-sm text-blue-700">
                  {billingFrequency === "annual" ? selectedPlan.annualPrice : selectedPlan.monthlyPrice}
                  {selectedPlan.annualAmount > 0 && (
                    <span className="text-blue-600 ml-2">
                      (billed {billingFrequency})
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-md transition-colors duration-200 text-sm disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!selectedMembership || isLoading}
            className="flex-1 bg-[#9FC93B] hover:bg-[#89B534] text-white font-medium py-3 rounded-md transition-colors duration-200 text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              selectedPlan?.annualAmount === 0 ? 'Complete Registration' : 'Continue to Payment'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
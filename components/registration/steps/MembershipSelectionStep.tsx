'use client';

import React, { useState } from 'react';

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
}

const INDIVIDUAL_MEMBERSHIPS = [
  {
    type: "free",
    title: "Free Membership",
    description: "Get started with basic community access",
    monthlyAmount: 0,
    annualAmount: 0,
    annualPrice: "R0/year",
    monthlyPrice: "R0/month",
  },
  {
    type: "individual_silver",
    title: "Individual Silver",
    description: "Perfect for entrepreneurs and small business owners",
    monthlyAmount: 46,
    annualAmount: 500,
    annualPrice: "R500/year",
    monthlyPrice: "R46/month",
  },
  {
    type: "individual_gold",
    title: "Individual Gold",
    description: "Enhanced benefits for growing businesses",
    monthlyAmount: 115,
    annualAmount: 1250,
    annualPrice: "R1,250/year",
    monthlyPrice: "R115/month",
  },
  {
    type: "individual_platinum",
    title: "Individual Platinum",
    description: "Comprehensive support for established businesses",
    monthlyAmount: 230,
    annualAmount: 2500,
    annualPrice: "R2,500/year",
    monthlyPrice: "R230/month",
  },
];

const ORGANIZATIONAL_MEMBERSHIPS = [
  {
    type: "organizational_silver",
    title: "Organizational Silver",
    description: "Great for small organizations and non-profits",
    monthlyAmount: 230,
    annualAmount: 2500,
    annualPrice: "R2,500/year",
    monthlyPrice: "R230/month",
  },
  {
    type: "organizational_gold",
    title: "Organizational Gold",
    description: "Enhanced organizational benefits",
    monthlyAmount: 350,
    annualAmount: 3500,
    annualPrice: "R3,500/year",
    monthlyPrice: "R350/month",
  },
  {
    type: "organizational_platinum",
    title: "Organizational Platinum",
    description: "Full-service organizational membership",
    monthlyAmount: 460,
    annualAmount: 5000,
    annualPrice: "R5,000/year",
    monthlyPrice: "R460/month",
  },
];

export const MembershipSelectionStep = ({
  data,
  onNext,
  onBack,
}: MembershipSelectionStepProps) => {
  const [selectedMembership, setSelectedMembership] = useState(data.membershipType || "");
  const [billingFrequency, setBillingFrequency] = useState<"monthly" | "annual">(
    data.billingFrequency || "annual"
  );

  const accountType = data.accountType || "individual";
  const currentMemberships = accountType === "individual" 
    ? INDIVIDUAL_MEMBERSHIPS 
    : ORGANIZATIONAL_MEMBERSHIPS;

  const selectedPlan = currentMemberships.find(plan => plan.type === selectedMembership);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlan) {
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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

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
            <label className={`flex items-center space-x-2 border rounded-lg p-4 hover:bg-white cursor-pointer ${
              billingFrequency === "annual" ? "bg-white border-[#9FC93B] shadow-sm" : "border-gray-300"
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
                <p className="text-sm text-gray-500">Pay once per year (Save up to 20%)</p>
              </div>
            </label>
            <label className={`flex items-center space-x-2 border rounded-lg p-4 hover:bg-white cursor-pointer ${
              billingFrequency === "monthly" ? "bg-white border-[#9FC93B] shadow-sm" : "border-gray-300"
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
                <p className="text-sm text-gray-500">Pay monthly (More flexible)</p>
              </div>
            </label>
          </div>
        </div>

        {/* Membership Plans */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            {accountType === "individual" ? "Individual" : "Organizational"} Membership Plans
          </h3>
          <div className="space-y-3">
            {currentMemberships.map((plan) => (
              <label
                key={plan.type}
                className={`block border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedMembership === plan.type
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
                        {plan.annualAmount > 0 && billingFrequency === "annual" && (
                          <div className="text-xs text-gray-500">
                            Save {Math.round(((plan.annualAmount - (plan.monthlyAmount * 12)) / plan.annualAmount) * 100)}%
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
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
              {/* {selectedPlan.annualAmount > 0 && billingFrequency === "annual" && (
                <div className="text-sm text-blue-700 font-medium">
                  Save {formatAmount((plan.monthlyAmount * 12) - plan.annualAmount)}/year
                </div>
              )} */}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-md transition-colors duration-200 text-sm"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!selectedMembership}
            className="flex-1 bg-[#9FC93B] hover:bg-[#89B534] text-white font-medium py-3 rounded-md transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedPlan?.annualAmount === 0 ? 'Complete Registration' : 'Continue to Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};
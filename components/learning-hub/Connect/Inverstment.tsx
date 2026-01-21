import React from 'react';
import { TrendingUp } from 'lucide-react';

export function InvestmentOpportunities() {
  return (
    <div className="text-center py-12">
      <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Investment Opportunities Coming Soon</h3>
      <p className="text-gray-600">
        We're curating exclusive investment opportunities for our members.
      </p>
    </div>
  );
}
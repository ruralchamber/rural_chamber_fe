"use client";

import React, { useState } from 'react';
import { TabNavigation } from './TabNav';
import { MemberOpportunities } from './Membership';
import { BusinessTrips } from './BusinessTrip';
import { InvestmentOpportunities } from './Inverstment';
import { NetworkingHub } from './NetworkingHub';

export default function ConnectHub() {
  const [activeTab, setActiveTab] = useState('opportunities');

  return (
    <div className="min-h-screen bg-gray-50">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'opportunities' && <MemberOpportunities />}
        {activeTab === 'trips' && <BusinessTrips />}
        {activeTab === 'investments' && <InvestmentOpportunities />}
        {activeTab === 'network' && <NetworkingHub />}
      </div>
    </div>
  );
}
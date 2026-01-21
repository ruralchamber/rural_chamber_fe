// components/Tabs.tsx
import React from 'react';
import { Calendar, Plane } from 'lucide-react';

interface TabsProps {
  activeTab: 'events' | 'trips';
  onTabChange: (tab: 'events' | 'trips') => void;
  eventCount: number;
  tripCount: number;
}

export default function Tabs({ activeTab, onTabChange, eventCount, tripCount }: TabsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="flex border-b">
        <button
          onClick={() => onTabChange('events')}
          className={`flex-1 px-6 py-4 font-medium transition-colors ${
            activeTab === 'events'
              ? 'text-[#9FC93B] border-b-2 border-[#9FC93B]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-5 h-5 inline mr-2" />
          Events ({eventCount})
        </button>
        <button
          onClick={() => onTabChange('trips')}
          className={`flex-1 px-6 py-4 font-medium transition-colors ${
            activeTab === 'trips'
              ? 'text-[#9FC93B] border-b-2 border-[#9FC93B]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Plane className="w-5 h-5 inline mr-2" />
          Business Trips ({tripCount})
        </button>
      </div>
    </div>
  );
}
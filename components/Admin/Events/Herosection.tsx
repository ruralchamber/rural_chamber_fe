// components/Herosection.tsx
import React from 'react';

interface HeroEventsProps {
  onExport: () => void;
}

export default function HeroEvents({ onExport }: HeroEventsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Admin Events and Trips</h1>
        <button
          onClick={onExport}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Export Data
        </button>
      </div>
      <p className="text-gray-600">Manage events and business trips for members</p>
    </div>
  );
}
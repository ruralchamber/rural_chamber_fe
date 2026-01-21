import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { OpportunityCard } from './Oppotunities';

interface Opportunity {
  id: number;
  title: string;
  type: string;
  industry: string[];
  location: string;
  deadline: string;
  status: 'open' | 'closing_soon';
  description: string;
}

export function MemberOpportunities() {
  const opportunities: Opportunity[] = [
    {
      id: 1,
      title: 'Supply Agricultural Equipment to Government',
      type: 'Tender',
      industry: ['Agriculture', 'Equipment'],
      location: 'Limpopo Province',
      deadline: '2025-12-20',
      status: 'open',
      description: 'Looking for suppliers of agricultural equipment and machinery for rural development project.',
    },
    {
      id: 2,
      title: 'Strategic Partnership - Renewable Energy',
      type: 'Partnership',
      industry: ['Energy', 'Technology'],
      location: 'National',
      deadline: '2025-12-15',
      status: 'closing_soon',
      description: 'Seeking partners for solar energy installation projects in rural areas.',
    },
    {
      id: 3,
      title: 'Logistics Services Contract',
      type: 'Contract',
      industry: ['Transportation', 'Logistics'],
      location: 'Gauteng',
      deadline: '2026-01-10',
      status: 'open',
      description: '3-year contract for logistics and distribution services.',
    },
  ];

  return (
    <div>
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search opportunities..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FC93B]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {opportunities.map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
      </div>
    </div>
  );
}
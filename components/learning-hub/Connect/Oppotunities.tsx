import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: {
    id: number;
    title: string;
    type: string;
    industry: string[];
    location: string;
    deadline: string;
    status: 'open' | 'closing_soon';
    description: string;
  };
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatDate = (dateString: string) => {
    if (!isMounted) {
      // During SSR, use a consistent format
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }
    
    // On client, use locale formatting
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            opportunity.status === 'closing_soon' 
              ? 'bg-orange-100 text-orange-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {opportunity.status === 'closing_soon' ? 'Closing Soon' : 'Open'}
          </span>
          <span className="ml-2 text-sm text-gray-500">{opportunity.type}</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{opportunity.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{opportunity.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {opportunity.industry.map((ind) => (
          <span key={ind} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
            {ind}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {opportunity.location}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          Deadline: {formatDate(opportunity.deadline)}
        </div>
      </div>
      
      <button className="w-full bg-[#9FC93B] text-white py-2 rounded-lg font-medium hover:bg-[#8AB82F] transition-colors flex items-center justify-center gap-2">
        View Details
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Leaf, Apple, HardHat, TrendingUp, Dna, ArrowRight, X } from 'lucide-react';

const PawIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <ellipse cx="8.5" cy="7" rx="2.5" ry="3"/>
    <ellipse cx="15.5" cy="7" rx="2.5" ry="3"/>
    <ellipse cx="6" cy="13" rx="2" ry="2.5"/>
    <ellipse cx="18" cy="13" rx="2" ry="2.5"/>
    <ellipse cx="12" cy="16" rx="3.5" ry="4"/>
  </svg>
);

const DropletIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>
);

interface LegislationItem {
  title: string;
  date: string;
}

interface LegislationCategory {
  icon: any;
  title: string;
  description: string;
  color: string;
  legislationData: LegislationItem[];
}

export default function FarmingLegislation() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<LegislationCategory | null>(null);

  const legislationCategories: LegislationCategory[] = [
    {
      icon: Globe,
      title: "Land Use & Ownership Laws",
      description: "Regulate land rights, zoning, and sustainable farming.",
      color: "bg-green-400",
      legislationData: [
        { title: "Agricultural Land Act", date: "July 3, 2024" },
        { title: "Zoning & Land Use Laws", date: "July 5, 2024" },
        { title: "Land Redistribution & Reform Laws", date: "July 7, 2024" },
        { title: "Eminent Domain & Expropriation Laws", date: "July 8, 2024" },
        { title: "Land Conservation & Restoration Acts", date: "July 9, 2024" },
        { title: "Homestead & Smallholder Farming Acts", date: "July 10, 2024" },
        { title: "Leasehold & Tenant Farming Regulations", date: "July 11, 2024" },
        { title: "Indigenous & Tribal Land Rights Laws", date: "July 13, 2024" },
        { title: "Agro-Industrial Zoning Laws", date: "July 14, 2024" },
        { title: "Pastoral & Rangeland Management Laws", date: "July 15, 2024" },
        { title: "Property Tax & Exemptions for Farmers", date: "July 16, 2024" },
        { title: "Agricultural Easements", date: "July 17, 2024" },
      ],
    },
    {
      icon: Leaf,
      title: "Environmental & Conservation Laws",
      description: "Protect natural resources and promote eco-friendly farming.",
      color: "bg-blue-400",
      legislationData: [
        { title: "Environmental Protection Act", date: "June 3, 2024" },
        { title: "Soil Conservation Laws", date: "June 5, 2024" },
        { title: "Biodiversity Protection Act", date: "June 7, 2024" },
        { title: "Wetlands Conservation Laws", date: "June 8, 2024" },
        { title: "Pesticide Regulation Act", date: "June 9, 2024" },
        { title: "Forest Conservation Laws", date: "June 10, 2024" },
      ],
    },
    {
      icon: Apple,
      title: "Food Safety & Quality Laws",
      description: "Ensure hygiene, safety, and labeling of food products.",
      color: "bg-pink-400",
      legislationData: [
        { title: "Food Safety Standards Act", date: "May 3, 2024" },
        { title: "Food Labeling Regulations", date: "May 5, 2024" },
        { title: "Organic Certification Laws", date: "May 7, 2024" },
        { title: "Food Additive Regulations", date: "May 8, 2024" },
        { title: "Import/Export Food Safety Laws", date: "May 9, 2024" },
      ],
    },
    {
      icon: HardHat,
      title: "Labor & Employment Laws",
      description: "Protect farmworkers' rights, wages, and working conditions.",
      color: "bg-[#FF7C51B2]",
      legislationData: [
        { title: "Agricultural Labor Standards Act", date: "April 3, 2024" },
        { title: "Farmworker Safety Regulations", date: "April 5, 2024" },
        { title: "Minimum Wage for Farmworkers", date: "April 7, 2024" },
        { title: "Seasonal Worker Protection Laws", date: "April 8, 2024" },
        { title: "Migrant Farmworker Rights", date: "April 9, 2024" },
      ],
    },
    {
      icon: TrendingUp,
      title: "Agricultural Trade & Subsidy Laws",
      description: "Govern trade, market prices, and farmer support.",
      color: "bg-[#FEBD53B2]",
      legislationData: [
        { title: "Agricultural Subsidy Act", date: "March 3, 2024" },
        { title: "Export Promotion Laws", date: "March 5, 2024" },
        { title: "Import Tariff Regulations", date: "March 7, 2024" },
        { title: "Price Support Programs", date: "March 8, 2024" },
        { title: "Trade Agreement Compliance", date: "March 9, 2024" },
      ],
    },
    {
      icon: PawIcon,
      title: "Animal Welfare & Livestock Laws",
      description: "Ensure humane treatment and health of farm animals.",
      color: "bg-red-400",
      legislationData: [
        { title: "Animal Welfare Act", date: "February 3, 2024" },
        { title: "Livestock Transport Regulations", date: "February 5, 2024" },
        { title: "Antibiotic Use in Livestock", date: "February 7, 2024" },
        { title: "Humane Slaughter Laws", date: "February 8, 2024" },
        { title: "Livestock Identification Laws", date: "February 9, 2024" },
      ],
    },
    {
      icon: DropletIcon,
      title: "Water Rights & Irrigation Laws",
      description: "Manage water use, conservation, and irrigation.",
      color: "bg-[#A000BCB2]",
      legislationData: [
        { title: "Water Rights Allocation Act", date: "January 3, 2024" },
        { title: "Irrigation Water Use Regulations", date: "January 5, 2024" },
        { title: "Groundwater Protection Laws", date: "January 7, 2024" },
        { title: "Water Conservation Measures", date: "January 8, 2024" },
        { title: "Agricultural Water Quality Standards", date: "January 9, 2024" },
      ],
    },
    {
      icon: Dna,
      title: "Biotechnology & GMO Regulations",
      description: "Control GMOs, biotech crops, and food safety.",
      color: "bg-indigo-400",
      legislationData: [
        { title: "GMO Regulation Act", date: "December 3, 2023" },
        { title: "Biotech Crop Approval Process", date: "December 5, 2023" },
        { title: "GMO Labeling Requirements", date: "December 7, 2023" },
        { title: "Biotech Research Guidelines", date: "December 8, 2023" },
        { title: "GMO Import/Export Regulations", date: "December 9, 2023" },
      ],
    },
  ];

  const handleCategoryClick = (category: LegislationCategory) => {
    setSelectedCategory(category);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Farming Legislation
          </h1>
          <p className="text-gray-600 text-lg">
            Know the Laws, Grow with Confidence. Learn the key farming regulations to protect your land, crops, and business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {legislationCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                onClick={() => handleCategoryClick(category)}
              >
                <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                  <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {category.description}
                </p>
                <div className="flex justify-end">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full group-hover:bg-gray-100 transition-colors">
                    <ArrowRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedCategory && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`${selectedCategory.color} w-10 h-10 rounded-full flex items-center justify-center`}>
                    {selectedCategory.icon && React.createElement(selectedCategory.icon as any, {
                      className: "w-6 h-6 text-white",
                      strokeWidth: 2
                    })}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedCategory.title}
                  </h3>
                </div>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-600">
                  Browse through the specific legislation related to {selectedCategory.title.toLowerCase()}. 
                  Click on any legislation to view more details.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Legislation Title
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedCategory.legislationData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-[#9FC93B] hover:text-[#8AB82F] text-sm font-medium underline">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back to Categories
                </button>
                <button className="px-6 py-2.5 bg-[#9FC93B] text-white rounded-lg font-medium hover:bg-[#8AB82F] transition-colors">
                  Download All Legislation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
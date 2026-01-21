'use client'

import React from 'react';

const ImpactBenefits = () => {
  const benefits = [
    "Economic growth in rural areas",
    "Job creation and poverty reduction",
    "Support for small businesses and entrepreneurs",
    "Development of key rural industries (agriculture, tourism, and mining)",
    "Enhanced access to markets and resources",
    "Advocacy for rural business needs",
    "Increased skills and capacity through training",
    "Strengthened rural infrastructure and connectivity",
    "Promotion of sustainable development practices",
    "Building resilient and self-sufficient rural communities"
  ];

  return (
    <section className="w-full min-h-[700px] bg-gray-50 py-16 lg:py-0 lg:flex lg:items-center">
      <div className="w-full lg:h-screen lg:flex lg:items-center lg:relative">
        
        <div className="block lg:hidden px-6 space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="w-12 h-1 bg-orange-500 mb-6"></div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Impact / Benefits
            </h2>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
                  <span className="text-gray-700 text-base">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full">
            <img
              src="/about/benefits.svg"
              alt="Growth visualization"
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="hidden lg:block w-full h-full relative">
          
          <div className="absolute right-[5%] top-[0%] bottom-[0%] w-[65%]">
            <img
              src="/about/benefits.svg"
              alt="Growth visualization"
              className="w-full h-full object-cover"
            />
          </div>


          <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-full max-w-md z-10">
            <div className="bg-white p-8 shadow-2xl">
              <div className="w-12 h-1 bg-orange-500 mb-4"></div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Impact / Benefits
              </h2>
              <ul className="space-y-2.5">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0"></span>
                    <span className="text-gray-600 text-xs leading-snug">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactBenefits;
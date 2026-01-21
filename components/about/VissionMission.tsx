'use client'

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const VisionMissionObjectives: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariant = {
    initial: { opacity: 0, y: 40 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3"
            style={{ color: '#2B1810' }}
          >
            Vision, Mission & Objectives
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            We are dedicated to building a World Class Economic Development Institute in Africa.
          </p>
        </motion.div>

        {/* Cards Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Vision Card */}
          <motion.div 
            className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
            variants={cardVariant}
          >
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-4" style={{ color: '#2B1810' }}>
              Vision
            </h3>
            <p className="text-gray-600 text-center text-sm leading-relaxed">
              A World Class Economic Development Institute in Africa
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div 
            className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
            variants={cardVariant}
          >
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-4" style={{ color: '#2B1810' }}>
              MISSION
            </h3>
            <p className="text-gray-600 text-center text-sm leading-relaxed">
              To formulate and implement effective economic development strategies that will create sustainable companies and create jobs in Southern Africa through convening and packaging strategies
            </p>
          </motion.div>

          {/* LEDI Objectives Card */}
          <motion.div 
            className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
            variants={cardVariant}
          >
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-4" style={{ color: '#2B1810' }}>
              LEDI Objectives
            </h3>
            <ul className="text-gray-600 text-sm leading-relaxed space-y-2">
              <li className="flex items-start">
                <span className="text-red-600 mr-2 mt-1 shrink-0">•</span>
                <span>Working with Small Medium Enterprises (SME's) in townships and rural economies</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2 mt-1 shrink-0">•</span>
                <span>Establishing Enterprise Development Laboratories in South Africa</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2 mt-1 shrink-0">•</span>
                <span>Target Critical Sectors of Economy – Including import substitutions</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Strategic Programmes Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className=" pt-10">
            <h2 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6"
              style={{ color: '#2B1810' }}
            >
              Amandla Omnotho Strategic Programmes
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                Amandla Omnotho currently has over 100,000 entrepreneurs in its database and has a clear target in terms of its engagement in the South African entrepreneurial landscape, and it is as follows:
              </p>
              
              <ul className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-2">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1 shrink-0">•</span>
                  <span>Creating 2000 New Businesses in 5 years (2020 – 2025)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1 shrink-0">•</span>
                  <span>Creating 1,000,000 jobs in 10 years (2020 – 2030)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1 shrink-0">•</span>
                  <span>Ensure 10% of SME's Participate in African Continental Trade Area Agreement (AfCFTA) in 10 years (2030)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1 shrink-0">•</span>
                  <span>Ensure 10% of South African SME's becoming Multinational Enterprises (MNE's) in 10 years</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1 shrink-0">•</span>
                  <span>Ensure 01% of these SME's are Listed on the Stock Exchanges within 10 years</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1 shrink-0">•</span>
                  <span>Establish Amandla Omnotho Trust Fund – 2021, to raise R20m in 36 months</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VisionMissionObjectives;
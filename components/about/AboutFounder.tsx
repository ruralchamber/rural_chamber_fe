'use client'

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const AboutFounder: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, delay: 0.2 }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, delay: 0.3 }
  };

  const credentials = [
    {
      label: 'President & Founder:',
      value: 'Lighthouse Economic Development Institute / Amandia Omnotho'
    },
    {
      label: 'Chairman:',
      value: 'Adamo Holdings (Pty) Ltd & African Liberty Movement – NPC'
    },
    {
      label: 'Board/Executive Member:',
      value: 'FoodBev SETA'
    },
    {
      label: 'Chairman:',
      value: 'eThekwini Smart Port City Innovation Workstream'
    },
    {
      label: 'Resident Contributor:',
      value: 'Ukhozi FM/Sanlam/1KZN TV – Amandia Omnotho Programme'
    },
    {
      label: 'Education:',
      value: 'holds Master of Management in Entrepreneurship & New Venture Creation (Wits Bus School)'
    },
    {
      label: 'Management Advancement Programme (MAP – WBS),'
    },
    {
      label: 'Bachelor of Technology – Quality Management,'
    },
    {
      label: 'UNISA, National Diploma, Electrical Engineering (MUT)'
    },
    {
      label: 'Diploma - Project Management (Varsity College)'
    },
    {
      label: 'Certified Quality Engineer (SQM)'
    },
    {
      label: 'Certified Business and Life Coach (Crystal Clear Institute)'
    }
  ];

  return (
    <div className="w-full mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 lg:mb-16"
          style={{ color: '#5A1A1A' }}
          {...fadeInUp}
        >
          About the founder
        </motion.h2>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
          {/* Left side - Image (40% on lg) */}
          <motion.div 
            className="w-full lg:w-[40%] flex justify-center"
            {...fadeInLeft}
          >
            <div className="relative w-full max-w-sm lg:max-w-none">
              <div className=" overflow-hidden relative aspect-square">
                <Image
                  src="/about.png"
                  alt="Founder"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  priority
                />
              </div>
              
            </div>
          </motion.div>

          {/* Right side - Content (60% on lg) */}
          <motion.div 
            className="w-full lg:w-[60%] space-y-4"
            {...fadeInRight}
          >
            {credentials.map((item, index) => (
              <motion.div
                key={index}
                className="text-sm sm:text-base leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
              >
                {item.value ? (
                  <>
                    <span className="font-semibold text-gray-800">{item.label}</span>{' '}
                    <span className="text-gray-600">{item.value}</span>
                  </>
                ) : (
                  <span className="text-gray-600">{item.label}</span>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutFounder;
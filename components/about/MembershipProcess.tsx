'use client'

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface Step {
  number: string;
  title: string;
}

interface MembershipComponentProps {
  steps: Step[];
  title?: string;
  description?: string;
}

export const MembershipProcess: React.FC<MembershipComponentProps> = ({
  steps,
  title = "The Rural Chamber of Commerce and Industry",
  description = `The Rural Chamber of Commerce and Industry was founded to address the pressing economic challenges faced by South Africa's rural areas. With limited access to markets, finance, shift development, and infrastructure, rural communities often struggle to unlock their full potential. Our mission is to bridge these gaps by creating a supportive environment that fosters entrepreneurship, drives economic growth, and transforms lives.

We are committed to building a thriving business ecosystem that empowers rural businesses and industries, particularly in agriculture, tourism, and small-scale mining. Through tailored business support services, advocacy, training, and networking opportunities, we aim to reduce poverty, create sustainable jobs, and contribute to the overall development of South Africa's rural economy.

At the Rural Chamber of Commerce and Industry, we believe in the power of collaboration, innovation, and perseverance to create a brighter future for rural communities. Together, we are shaping a South Africa where every community has the opportunity to prosper.`
}) => {
  const containerVariants:Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants:Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const textVariants:Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="bg-white  overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left Section - 35% width with background color */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:w-[35%] bg-[#2C6E630D] p-8"
          >
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-bold text-[#01311B] mb-6"
            >
              Membership Process
            </motion.h2>
            
            <motion.div
              variants={containerVariants}
              className="space-y-6"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start space-x-4"
                >
                  <div className="shrink-0 w-8 h-8 bg-[#2C6E63] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {step.number}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg  text-gray-800 leading-tight">
                      {step.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Section - 65% width */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textVariants}
            className="lg:w-[65%] p-8"
          >
           
            
            <motion.div
              variants={textVariants}
              className="space-y-4 text-gray-700 leading-relaxed"
            >
              {description.split('\n\n').map((paragraph, index) => (
                <motion.p
                  key={index}
                  variants={textVariants}
                  className="text-justify"
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Example usage with your data
export const MembershipData: Step[] = [
  {
    number: "1",
    title: "Complete the Membership Application Form"
  },
  {
    number: "2", 
    title: "Submit Required Documentation"
  },
  {
    number: "3",
    title: "Make Membership Fee Payment"
  },
  {
    number: "4",
    title: "Receive Welcome Package and Member Credentials"
  },
  {
    number: "5",
    title: "Start Accessing Member Benefits and Opportunities"
  }
];
//components/home/MembershipPricing.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

export default function MembershipPricing() {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">(
    "annual"
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const pricingTiers = [
    {
      name: "Free Membership",
      price: "R0",
      period: "/Year",
      subtitle: "Access to Industry-Specific Content",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      features: ["Limited Networking Opportunities"],
      buttonText: "Join for Free",
      buttonStyle: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
    },
    {
      name: "Individual Silver",
      price: "R500",
      period: "/Year",
      subtitle: "Perfect for entrepreneurs and small business owners",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      features: [
        "Networking Sessions/Stream",
        "Access to Monthly Events",
        "Business Planning & Advisory",
        "Business Finance Support Assistance",
        "Association Affiliation",
      ],
      buttonText: "Select Plan",
      buttonStyle: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
    },
    {
      name: "Individual Gold",
      price: "R1250",
      period: "/Year",
      subtitle: "Enhanced benefits for growing businesses",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      features: [
        "All Silver features and more",
        "Onakaza Membership benefits:",
        "Goals farming study guides.",
        "Access to online practicals, member card",
        "Enhanced networking opportunities with tangible actions and results",
      ],
      buttonText: "Select Plan",
      buttonStyle: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
    },
  ];

  return (
    <div className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <motion.div
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
       
        <motion.div
          className="text-center mb-12 lg:mb-16"
          variants={cardVariants}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#01311B] mb-4">
            Choose Your Membership
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Select the membership plan that best fits your business needs
          </p>
        </motion.div>

       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
              }}
              className="relative"
            >
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sm:p-8 h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
            
                <div className="mb-6">
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                      {tier.price}
                    </span>
                    <span className="text-base text-gray-500 ml-2">
                      {tier.period}
                    </span>
                  </div>
                  <div className={`text-lg font-semibold mb-2 ${tier.color}`}>
                    {tier.name}
                  </div>
                  <p className="text-sm text-gray-600">{tier.subtitle}</p>

                  
                  <div className="h-1 relative top-2 mx-auto ">
                    <Image
                      src="/Divider.png"
                      alt="Divider"
                      fill
                      className="object-contain"
                    />
                  </div>

                </div>


                {tier.price !== "R0" && (
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setBillingCycle("annual")}
                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        billingCycle === "annual"
                          ? "bg-[#9FC93B] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Annual
                    </button>
                    <button
                      onClick={() => setBillingCycle("monthly")}
                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        billingCycle === "monthly"
                          ? "bg-[#9FC93B] text-white"
                          : "bg-gray-100  text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                )}

                {/* Features List */}
                <ul className="space-y-4 mb-8 grow">
                  {tier.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-sm text-gray-700"
                    >
                      <span className={`${tier.color} mr-3 mt-0.5 shrink-0`}>
                        <Check className="w-5 h-5" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full px-6 py-3 rounded-md text-base font-medium transition-all duration-300 flex items-center justify-center gap-2 ${tier.buttonStyle}`}
                  >
                    {tier.buttonText}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

            <motion.div variants={cardVariants} className="text-center">
              <motion.button
                onClick={() => window.location.href = "/membership"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#9FC93B] text-white text-base font-medium rounded-md hover:bg-[#8AB82F] transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                View All
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.span>
              </motion.button>
            </motion.div>
      </motion.div>
    </div>
  );
}

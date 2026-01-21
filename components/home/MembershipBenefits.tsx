"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

interface Objective {
  image: string;
  title: string;
  description: string;
  borderImage?: string;
}

interface ObjectivesSectionProps {
  sectionTitle?: string;
  objectives: Objective[];
  backgroundColor?: string;
}

export const MembershipBenefits: React.FC<ObjectivesSectionProps> = ({
  sectionTitle = "Our Objectives",
  objectives,
  backgroundColor = "bg-white",
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <section className={`w-full ${backgroundColor} py-16 sm:py-20 lg:py-24`}>
      <div className="mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#01311B] text-center mb-12 lg:mb-16"
        >
          {sectionTitle}
        </motion.h2>

        {/* Objectives Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {objectives.map((objective, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              {/* Card Container */}
              <div className="flex flex-col h-full">
                {/* Image */}
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={objective.image}
                    alt="Benefit Icon"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                  <span className="text-sm font-semibold tracking-wide text-[#01311B] uppercase">
                    Benefits
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#01311B] mb-3 leading-tight">
                  {objective.title}
                </h3>

                {/* Border Line */}
                {objective.borderImage && (
                  <div className="relative w-full h-[3px] mb-4">
                    <Image
                      src={objective.borderImage}
                      alt="Border decoration"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Description */}
                <p className="text-base text-gray-600 leading-relaxed">
                  {objective.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

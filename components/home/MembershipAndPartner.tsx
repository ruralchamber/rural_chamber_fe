'use client'

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { User, Briefcase, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MembershipAndPartners() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const partners = [
    { name: 'Global Good', logo: '/home/image 7.png' },
    { name: 'OAO Foundation', logo: '/home/image 8.png' },
    { name: 'Women Empowerment', logo: '/home/image 9.png' },
    { name: 'Women Together', logo: '/home/image 10.png' },
    { name: 'Foundation', logo: '/home/image 11.png' }
  ];

 

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1]
      }
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Membership Tiers Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 "
          >
            {/* Left Section - Membership Tiers */}
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#01311B] mb-4">
                Membership Tiers
              </h2>

              {/* Divider Image */}
              <div className="relative  h-1 mb-8">
                <Image
                  src="/Divider.png"
                  alt="Divider"
                  fill
                  className="object-contain object-left"
                />
              </div>

              {/* Membership Types */}
              <div className="grid grid-cols-3 gap-6 sm:gap-8">
                {/* Individual */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center  mb-4 group-hover:border-[#9FC93B] transition-colors duration-300">
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 group-hover:text-[#9FC93B] transition-colors duration-300" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Individual
                  </h3>
                </motion.div>

                {/* Business */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center  mb-4 group-hover:border-[#9FC93B] transition-colors duration-300">
                    <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 group-hover:text-[#9FC93B] transition-colors duration-300" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Business
                  </h3>
                </motion.div>

                {/* Organization */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center  mb-4 group-hover:border-[#9FC93B] transition-colors duration-300">
                    <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 group-hover:text-[#9FC93B] transition-colors duration-300" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Organization
                  </h3>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Section - Impact Image with Overlay */}
            <motion.div variants={itemVariants} className="relative">
              <div className="relative w-full aspect-16/10 overflow-hidden">
                <Image
                  src="/home/mem.png"
                  alt="Membership network"
                  fill
                  className="object-cover"
                />

                {/* Overlay Card - Bottom Right */}
                <div className="absolute bottom-6 right-6 bg-white p-6 shadow-xl max-w-[280px]">
                  <h3 className="text-lg font-bold text-[#01311B] mb-2">
                    OUR IMPACT
                  </h3>
                  
                  {/* Divider Image */}
                  <div className="relative h-2 mb-3">
                    <Image
                      src="/Divider.png"
                      alt="Divider"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Rural Chambers empower communities by driving growth and creating jobs.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Partners Section */}
      <section className="py-16 sm:py-20 lg:py-24 ">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#01311B] text-center mb-12 lg:mb-16"
          >
            Our Partners
          </motion.h2>

          {/* Partners Carousel */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`
              }}
            >
              {Array.from({ length: Math.ceil(partners.length / 3) }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="min-w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8"
                >
                  {partners.slice(slideIndex * 5, slideIndex * 5 + 5).map((partner, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center justify-center bg-white hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="relative w-full h-30">
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>

           
          </div>
        </div>
      </section>
    </div>
  );
}
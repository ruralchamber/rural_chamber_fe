'use client'

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function OurPartners() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const partners = [
    { name: 'Global Good', logo: '/home/image 7.png' },
    { name: 'OAO Foundation', logo: '/home/image 8.png' },
    { name: 'Women Empowerment', logo: '/home/image 9.png' },
    { name: 'Women Together', logo: '/home/image 10.png' },
    { name: 'Foundation', logo: '/home/image 11.png' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
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
      {/* Our Partners Section */}
      <section className="py-16 sm:py-20 lg:py-24">
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
                      className="flex items-center justify-center  p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
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
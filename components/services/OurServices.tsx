
'use client'

import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

interface Service {
  title: string;
  description: string;
  image: string;
}

interface OurServicesProps {
  title?: string;
  intro?: string;
  secondaryText?: string;
  services?: Service[];
}

export const OurServices: React.FC<OurServicesProps> = ({
  title = 'Our Services',
  intro = 'We empower rural businesses and communities with the tools, support, and opportunities they need to thrive and drive sustainable development.',
  secondaryText = 'Rural areas present opportunities for economic growth, particularly in the agriculture, tourism, and small-scale mining sectors.',
  services = [
    {
      title: 'Business Support Services',
      description: 'We provide tailored support to help rural businesses grow, from operational guidance to strategic planning.',
      image: '/services/1.png'
    },
    {
      title: 'Training and Workshops',
      description: 'Empowering entrepreneurs with essential skills and knowledge through expert-led training sessions and workshops.',
      image: '/services/2.png'
    },
    {
      title: 'Networking Opportunities',
      description: 'Connecting members with industry leaders, investors, and fellow entrepreneurs to foster partnerships and collaboration.',
      image: '/services/3.png'
    },
    {
      title: 'Market Access Support',
      description: 'Helping rural businesses connect with broader markets through research, insights, and promotional opportunities.',
      image: '/services/4.png'
    },
    {
      title: 'Advocacy and Policy Influence',
      description: 'Representing rural business interests and influencing policies to create a more supportive economic environment.',
      image: '/services/5.png'
    },
    {
      title: 'Exclusive Member Benefits',
      description: 'Offering discounts, promotions, and access to resources available only to our members.',
      image: '/services/6.png'
    },
    {
      title: 'Research and Insights',
      description: 'Providing members with valuable data and insights to inform decision-making and stay ahead of industry trends.',
      image: '/services/7.png'
    },
    {
      title: 'Rural Community Development',
      description: 'Driving initiatives that enhance infrastructure, connectivity, and economic resilience in rural areas.',
      image: '/services/8.png'
    },
    {
      title: 'Event Hosting and Sponsorship',
      description: 'Organizing events, expos, and summits to showcase rural businesses and opportunities.',
      image: '/services/9.png'
    },
    {
      title: 'Sustainable Development Advocacy',
      description: 'Promoting practices that balance economic growth with environmental and social sustainability.',
      image: '/services/10.png'
    }
  ]
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants: Variants = {
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
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#01311B] mb-6">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-4 leading-relaxed">
            {intro}
          </p>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {secondaryText}
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              {/* Service Card */}
              <div className="flex flex-col h-full">
                {/* Image */}
                <div className="relative w-full aspect-16/10 overflow-hidden rounded-lg mb-5">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#01311B] mb-3 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
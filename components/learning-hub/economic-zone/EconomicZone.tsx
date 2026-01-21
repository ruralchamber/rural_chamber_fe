"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  ArrowRight,
  CheckCircle,
  Building2,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ServiceCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
  gradient: string;
}

export default function EconomicZoneMembersLounge() {
  const router = useRouter();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonTitle, setComingSoonTitle] = useState('');

  const services: ServiceCard[] = [
    {
      title: "Get an Investor",
      description: "Find the right investors for your business. Take our readiness assessment to determine if your business is investor-ready.",
      icon: <TrendingUp className="w-8 h-8" />,
      route: "/client/investor-readiness",
      color: "text-blue-600",
      gradient: "from-blue-50 to-blue-100",
    },
    {
      title: "Get a Mentor/Coach",
      description: "Connect with experienced mentors and coaches who can guide your business journey and help you overcome challenges.",
      icon: <Users className="w-8 h-8" />,
      route: "#",
      color: "text-purple-600",
      gradient: "from-purple-50 to-purple-100",
    },
    {
      title: "Grow Your Business",
      description: "Assess your business growth potential and get personalized recommendations on how to scale effectively.",
      icon: <Target className="w-8 h-8" />,
      route: "#",
      color: "text-green-600",
      gradient: "from-green-50 to-green-100",
    },
    {
      title: "Get Funding",
      description: "Explore funding opportunities and assess your readiness to secure loans, grants, or investments for your business.",
      icon: <DollarSign className="w-8 h-8" />,
      route: "#",
      color: "text-orange-600",
      gradient: "from-orange-50 to-orange-100",
    },
  ];

  const benefits = [
    "Comprehensive business assessments",
    "Personalized recommendations",
    "Direct connections to resources",
    "Expert guidance and support",
    "Track your progress over time",
    "Access to exclusive opportunities",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const handleServiceClick = (service: ServiceCard) => {
    if (service.route === "#") {
      setComingSoonTitle(service.title);
      setShowComingSoon(true);
    } else {
      router.push(service.route);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="bg-linear-to-r from-[#01311B] to-[#024d2f] text-white py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Building2 className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Member's Lounge
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Welcome to your exclusive Economic Zone. Access tools, assessments, and resources 
              designed to accelerate your business growth.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="cursor-pointer"
              onClick={() => handleServiceClick(service)}
            >
              <div className={`bg-linear-to-br ${service.gradient} rounded-2xl p-8 h-full border-2 border-transparent hover:border-[#9FC93B] transition-all duration-300 shadow-sm hover:shadow-xl`}>
                <div className={`${service.color} mb-4`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <div className="flex items-center text-[#9FC93B] font-semibold">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            What You'll Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-6 h-6 text-[#9FC93B] shrink-0 mt-1" />
                <span className="text-gray-700">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-linear-to-r from-[#9FC93B] to-[#8AB82F] rounded-2xl p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Take Your Business to the Next Level?
            </h3>
            <p className="text-lg mb-6 text-gray-100">
              Start with any of our assessments to discover how we can help your business grow.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => router.push('/client/investor-readiness')}
                className="bg-white text-[#9FC93B] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Check Investor Readiness
              </button>
              <button
                onClick={() => {
                  setComingSoonTitle('Find a Mentor');
                  setShowComingSoon(true);
                }}
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#9FC93B] transition-colors"
              >
                Find a Mentor
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {showComingSoon && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <Building2 className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Coming Soon!
              </h3>
              <p className="text-gray-600 mb-6">
                The "{comingSoonTitle}" feature is currently under development. 
                We're working hard to bring you this valuable resource soon!
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Stay tuned for updates or check out our other available services.
              </p>
              <button
                onClick={() => setShowComingSoon(false)}
                className="w-full px-6 py-3 bg-[#9FC93B] hover:bg-[#8AB82F] text-white rounded-lg font-medium transition-colors"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
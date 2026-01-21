"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const videos = [
  {
    thumbnail: "/hub.png",
    title: "Amanda Omnetho Sunday Session",
    description: "Short caption, insights, workshop context.",
    date: "Jan 7, 2024",
  },
  {
    thumbnail: "/hub.png",
    title: "Sunday Session: The Property Masterclass Introduction",
    description: "Intro segment to property talk.",
    date: "May 12, 2024",
  },
  {
    thumbnail: "/hub.png",
    title: "Turmeric Farmers’ Follow Up Meeting",
    description: "Weekly follow-up session.",
    date: "Mar 5, 2025",
  },
  {
    thumbnail: "/hub.png",
    title: "Rural Economy Opportunities",
    description: "Opportunities for rural business owners.",
    date: "Sep 14, 2023",
  },
  {
    thumbnail: "/hub.png",
    title: "Vuka Africa Breakfast Show: Amanqha rise JSE",
    description: "Interview and insights.",
    date: "Jul 12, 2025",
  },
  {
    thumbnail: "/hub.png",
    title: "Amanda Omnetho Year-End Engagement Session",
    description: "Year-end closing thoughts.",
    date: "Dec 4, 2024",
  },
];

export default function ContentSection() {
  return (
    <section className="w-full min-h-screen space-y-8 max-w-7xl mx-auto px-4 py-12">
      {/* Section Title */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-4xl font-semibold" style={{ color: "#490F13" }}>
          Expert Insights for Business Growth
        </h2>
        <p className="text-gray-500 mt-2  md:text-base">
          Checkout content created by industry leaders to gain
          <br />
          actionable insights for internal and business growth.
        </p>
      </div>

      {/* Featured Video */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex flex-col md:flex-row bg-white shadow-sm rounded-md overflow-hidden mb-16"
      >
        {/* Thumbnail */}
        <div className="relative w-full md:w-1/2 h-60 md:h-auto bg-gray-200">
          <Image
            src="/hero.jpg"
            alt="Featured Video"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
              ▶
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="p-6 flex flex-col justify-between w-full md:w-1/2">
          <div>
            <h3 className="lg:text-3xl  text-xl font-semibold mb-2" style={{ color: "#490F13" }}>
              Ukhozi FM
            </h3>
            <p className=" text-gray-600 leading-relaxed mb-4">
              Ukhozi FM TV’s Vuka Afrika Breakfast Show will feature a discussion on finance with Sfiso Nala (Financial Coach) and Gugulethu Xaba (Economic Analyst). They will cover topics on building personal wealth, sustaining businesses, and South Africa’s economic growth. Listeners will gain valuable insights into financial management and investment strategies.
            </p>
            <span
              className="inline-block text-white text-xs px-3 py-1 rounded"
              style={{ backgroundColor: "#A40F11" }}
            >
              Category
            </span>
          </div>
          <p className="text-xs text-gray-500 text-right mt-4">March 25, 2025</p>
        </div>
      </motion.div>

      {/* Youtube Section Title */}
      <h3 className="text-center text-xl md:text-2xl font-semibold mb-8" style={{ color: "#490F13" }}>
        Our Youtube Channel
      </h3>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <motion.div
            key={index}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-md shadow-sm p-3"
          >
            <div className="relative w-full h-48 bg-gray-200 rounded overflow-hidden">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                  ▶
                </div>
              </div>
            </div>

            <h4 className="mt-3 font-semibold" style={{ color: "#490F13" }}>
              {video.title}
            </h4>
            <p className="text-gray-600  mt-1">{video.description}</p>
            <p className="text-xs text-gray-500 mt-2">{video.date}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

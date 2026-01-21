"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

interface MembershipEventsProps {
  onViewAllEvents?: () => void;
}

export default function MembershipEvents({ onViewAllEvents }: MembershipEventsProps) {
  const handleViewAll = () => {
    if (onViewAllEvents) {
      onViewAllEvents();
    } else {
      
      console.log("View All Events clicked");
      window.location.href = "/events"; 
    }
  };

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
       
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#01311B] mb-4"
          >
            Membership
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-6"
          >
            Join us for our upcoming events to learn, gain new skills, and
            expand your professional network.
          </motion.p>
        </motion.div>

     
        <motion.article
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex flex-col lg:flex-row items-stretch">
      
            <div className="relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-auto min-h-[400px]">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <Image
                  src="/event.jpg"
                  alt="Golf Day Tournament"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </div>


            <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#01311B] mb-4">
                  Golf Day Tournament
                </h3>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
                  The Amandla Omnetho Inaugural Golf Day Tournament is set to
                  take place on March 26, 2025, at the Umhlali Country Club. The
                  event follows an Individual Stableford game format and
                  includes a Corporate 4 Ball entry fee of R10,000. The event is
                  supported by BRICS WBA and will host participants from 40
                  BRICS nations. Additional corporate sponsorship opportunities,
                  including watering hole branding, are available.
                </p>


                <motion.div variants={fadeUp} className="relative mb-6 h-1 mx-auto">
                  <Image
                    src="/Divider.png"
                    alt="Divider"
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  className="px-6 py-2.5 text-sm font-medium rounded-md text-white bg-[#01311B] hover:bg-[#024a28] transition-colors duration-300"
                  aria-label="Event"
                >
                  Event
                </button>
                <p className="text-sm text-gray-500 font-medium">
                  March 26, 2025
                </p>
              </div>
            </div>
          </div>
        </motion.article>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10 lg:mt-12"
        >
          <motion.button
            onClick={handleViewAll}
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
      </div>
    </section>
  );
}
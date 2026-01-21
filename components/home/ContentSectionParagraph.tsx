
'use client'

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

interface ContentSectionProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  backgroundColor?: string;
  maxWidth?: string;
  animationDelay?: number;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  description,
  buttonText,
  buttonHref,
  onButtonClick,
  backgroundColor = 'bg-white',
  maxWidth = 'max-w-3xl',
  animationDelay = 0
}) => {
  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (buttonHref) {
      window.location.href = buttonHref;
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: animationDelay
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

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1]
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <section className={`w-full ${backgroundColor} py-16 sm:py-20 lg:py-24`}>
      <div className="mx-auto px-6 sm:px-8 lg:px-12 max-w-7xl">
        <motion.div
          className={`mx-auto ${maxWidth} text-center`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Title */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6 lg:mb-8"
          >
            {title}
          </motion.h2>
          
          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-8 lg:mb-10"
          >
            {description}
          </motion.p>
          
          {/* Button */}
          {buttonText && (
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleButtonClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#9FC93B] text-white text-base font-medium hover:bg-[#8AB82F] transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              {buttonText}
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </motion.button>
          )}
        </motion.div>
      </div>
    </section>
  );
};
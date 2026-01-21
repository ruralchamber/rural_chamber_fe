"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  Variants,
} from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CTAParallaxSectionProps {
  backgroundImage: string;
  title: string;
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  overlayOpacity?: number;
}

export const CTAParallaxSection: React.FC<CTAParallaxSectionProps> = ({
  backgroundImage,
  title,
  buttonText = "Become a Member",
  buttonHref,
  onButtonClick,
  overlayOpacity = 0.6,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Smooth parallax effect
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Parallax transforms
  const y = useTransform(smoothProgress, [0, 1], ['-20%', '20%']);

  const opacity = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else if (buttonHref) {
      window.location.href = buttonHref;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[400px] sm:h-[450px] lg:h-[500px] overflow-hidden"
    >
      {/* Parallax Background Image */}
      <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-[200%]">
          <Image
            src={backgroundImage}
            alt="Call to action background"
            fill
            className="object-cover"
            quality={90}
            priority
          />
        </div>
      </motion.div>

      {/* Gradient Overlay */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/60"
      />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-7xl w-full">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={contentVariants}
            className="max-w-3xl"
          >
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6 lg:mb-8">
              {title}
            </h2>

            {/* Button */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleButtonClick}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-[#9FC93B] text-white text-base font-medium hover:bg-[#8AB82F] transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              {buttonText}
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
      </div>
    </section>
  );
};

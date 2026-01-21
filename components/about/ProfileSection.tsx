'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';

interface BulletPoint {
  text: string;
}

interface ProfileSectionProps {
  title: string;
  subtitle: string;
  description: string;
  bulletPoints: BulletPoint[];
  imageSrc: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
}

export default function ProfileSection({
  title,
  subtitle,
  description,
  bulletPoints,
  imageSrc,
  imageAlt,
  imagePosition = 'left',
  buttonText,
  buttonHref,
  onButtonClick
}: ProfileSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: imagePosition === 'left' ? -20 : 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 }
    }
  };

  const ImageComponent = (
    <motion.div
      variants={imageVariants}
      className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg"
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 20vw"
      />
    </motion.div>
  );

  const ContentComponent = (
    <motion.div variants={itemVariants} className="space-y-4 w-full">
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
      <ul className="space-y-2">
        {bulletPoints.map((point, index) => (
          <motion.li
            key={index}
            variants={itemVariants}
            className="flex items-start gap-2"
          >
            <span className="text-red-600 mt-1 shrink-0">•</span>
            <span className="text-gray-700 text-sm md:text-base">{point.text}</span>
          </motion.li>
        ))}
      </ul>
      {buttonText && (
        <motion.div variants={itemVariants} className="pt-4">
          {buttonHref ? (
            <a
              href={buttonHref}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300 shadow-md"
            >
              {buttonText}
              <span>→</span>
            </a>
          ) : (
            <button
              onClick={onButtonClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300 shadow-md"
            >
              {buttonText}
              <span>→</span>
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <section className="py-12 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="space-y-6"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2"
              style={{ color: '#490F13' }}
            >
              {title}
            </h2>
            <p className="text-gray-600 text-sm md:text-base">{subtitle}</p>
          </motion.div>

          {/* Content Grid */}
          <div className={`flex flex-col lg:flex-row gap-8 lg:gap-12 items-start ${
            imagePosition === 'right' ? 'lg:flex-row-reverse' : ''
          }`}>
            {/* Image - 20% on lg screens */}
            <div className="w-full lg:w-1/3">
              {ImageComponent}
            </div>
            
            {/* Content - 80% on lg screens */}
            <div className="w-full lg:w-2/3">
              {ContentComponent}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
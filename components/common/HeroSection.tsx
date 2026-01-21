'use client'

import React from 'react';
import Image from 'next/image';

interface CTAButton {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

interface HeroSectionProps {
  backgroundImage: string;
  tagline?: string;
  title: string;
  subtitle?: string;
  ctaButtons?: CTAButton[];
  overlayOpacity?: number;
  minHeight?: string;
  contentMaxWidth?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  backgroundImage,
  tagline,
  title,
  subtitle,
  ctaButtons,
  overlayOpacity = 0.7,
  minHeight = 'min-h-[600px] lg:min-h-[700px]',
  contentMaxWidth = 'max-w-2xl'
}) => {
  const handleButtonClick = (button: CTAButton) => {
    if (button.onClick) {
      button.onClick();
    } else if (button.href) {
      window.location.href = button.href;
    }
  };

  
  const renderTitleWithBreaks = () => {
    if (title.includes('\n')) {
      return title.split('\n').map((line, index, array) => (
        <React.Fragment key={index}>
          {line}
          {index < array.length - 1 && <br />}
        </React.Fragment>
      ));
    }
    return title;
  };

  return (
    <div className={`relative w-full overflow-hidden ${minHeight}`}>
      
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Hero background"
          fill
          priority
          className="object-cover"
          quality={50}
        />
        
        
        <div 
          className="absolute inset-0 bg-linear-to-b from-[#00170C]/80 via-[#00170C]/60 to-[#00170C]/70"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      <div className={`relative z-10 flex items-center ${minHeight} px-6 sm:px-8 lg:px-12 xl:px-16 py-20 lg:py-24`}>
        <div className="mx-auto max-w-7xl w-full">
          <div className={contentMaxWidth}>
            
            {tagline && (
              <p className="text-sm sm:text-base text-white/90 font-medium mb-4 tracking-wide">
                {tagline}
              </p>
            )}
            
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6 lg:mb-8">
              {renderTitleWithBreaks()}
            </h1>
            
            
            {subtitle && (
              <p className="text-base sm:text-lg lg:text-xl text-white/95 mb-8 lg:mb-10 leading-relaxed font-light">
                {subtitle}
              </p>
            )}
            
            
            {ctaButtons && ctaButtons.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4">
                {ctaButtons.map((button, index) => {
                  const isPrimary = button.variant !== 'secondary';
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleButtonClick(button)}
                      className={`
                        inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md text-base font-medium 
                        transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                        ${isPrimary
                          ? 'bg-[#9FC93B] text-white hover:bg-[#8AB82F] shadow-lg hover:shadow-xl'
                          : 'bg-transparent text-white border-2 border-white/80 hover:bg-white/10 hover:border-white backdrop-blur-sm'
                        }
                      `}
                    >
                      {button.text}
                      {button.icon && <span className="ml-1">{button.icon}</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
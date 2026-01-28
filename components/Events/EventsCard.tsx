"use client";

import Image from "next/image";
import { Calendar, ChevronRight } from "lucide-react";

interface EventCardProps {
  month: string;
  day: string | number;
  image: string;
  title: string;
  description: string;
  onClick?: () => void;
  showReadMore?: boolean;
  maxDescriptionLength?: number;
}

export default function EventCard({
  month,
  day,
  image,
  title,
  description,
  onClick,
  showReadMore = true,
  maxDescriptionLength = 120
}: EventCardProps) {
  
  const isValidImage = image && (
    image.startsWith('http') || 
    image.startsWith('https') || 
    image.startsWith('data:image') ||
    image.startsWith('/')
  );

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const displayDescription = showReadMore 
    ? truncateText(description, maxDescriptionLength)
    : description;

  return (
    <div 
      className="flex gap-4 border-b pb-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 group"
      onClick={onClick}
    >
      {/* Content */}
      <div className="flex-1">
        {/* Image */}
        <div className="w-full h-64 relative rounded-lg overflow-hidden mb-3 bg-linear-to-br from-green-100 to-green-200 group-hover:shadow-md transition-shadow">
          {isValidImage ? (
            <Image 
              src={image} 
              alt={title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized={image.startsWith('data:image')} 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-16 h-16 text-green-600 opacity-30" />
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              <span className="text-sm font-medium">View Details</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Date */}
          <div className="flex flex-col items-center gap-1 justify-start min-w-12">
            <span className="text-green-700 text-sm font-medium">{month}</span>
            <span className="text-3xl font-bold text-[#01311B] leading-none">
              {day}
            </span>
          </div>
          
          <div className="flex-1">
            <h3 className="text-[#01311B] font-semibold text-lg mb-2 line-clamp-1 group-hover:text-[#9FC93B] transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {displayDescription}
              {showReadMore && description && description.length > maxDescriptionLength && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick?.();
                  }}
                  className="text-[#9FC93B] hover:text-[#8AB82F] ml-1 font-medium inline-flex items-center"
                >
                  Read more <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import Image from "next/image";
import { Calendar } from "lucide-react";

interface EventCardProps {
  month: string;
  day: string | number;
  image: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export default function EventCard({
  month,
  day,
  image,
  title,
  description,
  onClick
}: EventCardProps) {
  
  const isValidImage = image && (
    image.startsWith('http') || 
    image.startsWith('https') || 
    image.startsWith('data:image') ||
    image.startsWith('/')
  );

  return (
    <div 
      className="flex gap-4 border-b pb-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2"
      onClick={onClick}
    >
      {/* Content */}
      <div className="flex-1">
        <div className="w-full h-64 relative rounded overflow-hidden mb-3 bg-linear-to-br from-green-100 to-green-200">
          {isValidImage ? (
            <Image 
              src={image} 
              alt={title} 
              fill 
              className="object-cover"
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
            <h3 className="text-[#01311B] font-semibold text-lg mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
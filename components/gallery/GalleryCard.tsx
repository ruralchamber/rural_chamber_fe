"use client";

import Image from "next/image";

interface GalleryProps {
  images: string[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Gallery({
  images,
  currentPage,
  totalPages,
  onPageChange,
}: GalleryProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Heading */}
      <h2 className="text-center text-gray-600 mb-10">
        We have gathered many beautiful moments during our journey
      </h2>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((src, index) => (
          <div key={index} className="relative w-full h-64 rounded-lg overflow-hidden">
            <Image
              src={src}
              alt={`Gallery Image ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-10 text-sm">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 border rounded disabled:opacity-30"
        >
          ‹
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page
                  ? "bg-[#01311B] text-white border-[#01311B]"
                  : "text-gray-600"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 border rounded disabled:opacity-30"
        >
          ›
        </button>
      </div>
    </div>
  );
}

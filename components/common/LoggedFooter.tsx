import React from 'react';
import Image from 'next/image';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function LoggedFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative w-full h-[3px] mb-8">
          <Image
            src="/Divider.png" 
            alt="Border decoration"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-gray-500 text-sm">
            Copyright © {currentYear} Rural Chamber of Commerce
          </div>

          <div className="flex gap-3">
            <a
              href="#"
              className="w-9 h-9 bg-black rounded flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
              aria-label="X (Twitter)"
            >
              <XIcon />
            </a>
            <a
              href="#"
              className="w-9 h-9 bg-[#1877F2] rounded flex items-center justify-center text-white hover:bg-[#0d65d9] transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} fill="currentColor" />
            </a>
            <a
              href="#"
              className="w-9 h-9 bg-linear-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="w-9 h-9 bg-[#FF0000] rounded flex items-center justify-center text-white hover:bg-[#cc0000] transition-colors"
              aria-label="YouTube"
            >
              <Youtube size={20} />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">POWERED BY</span>
            <div className="h-8 w-px bg-gray-300"></div>
            
            <div className="relative">
              <Image
                src="/his.png"
                alt="HIS Group - Connecting The World Through Code"
                height={64} 
                width={200} 
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
'use client';

import React from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
  rightImage: string;
  rightTitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, rightImage, rightTitle }) => {
  return (
    <div className="min-h-screen p-10 gap-20 flex flex-col lg:flex-row bg-white">
      {/* Left Section */}
      <div className="w-full lg:w-[40%] flex flex-col p-6 lg:p-10">
        {/* Logo */}
        <div className="mb-6">
          <div className="relative -left-15 w-auto h-20">
            <Image
              src="/logo2.png"
              alt="Rural Chamber of Commerce & Industry Logo"
              fill
              className="object-contain object-top-left"
              priority
            />
          </div>
        </div>

        {/* Form / Page Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative min-h-screen w-full lg:w-[60%]">
        <Image
          src={rightImage}
          alt="Background"
          fill
          className="object-cover rounded-2xl"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>
        {/* Title */}
        <div className="absolute top-10 left-10 z-20">
          <h2 className="text-white text-5xl font-bold leading-tight drop-shadow-lg max-w-lg">
            {rightTitle}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

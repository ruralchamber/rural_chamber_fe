"use client";

import { HeroSection } from "@/components/common/HeroSection";
import GalleryPage from "@/components/gallery/Gallery";
import { CTAParallaxSection } from "@/components/home/CTAParallexSection";
import React from "react";
import { useRouter } from "next/navigation";
export default function page() {

      const router = useRouter();

      const handleBecomeMember = () => {
      router.push("/membership");
      };

  return (
    <div>
      <HeroSection
        backgroundImage="/gallery/hero.jpg"
        title="Gallery"
        tagline="Moments Forever"
        ctaButtons={[]}
      />

      <div className="bg-white"><GalleryPage/></div>

      <CTAParallaxSection
        backgroundImage="/services/money.png"
        title="Become a member today and help build thriving rural communities!"
        buttonText="Become a Member"
        onButtonClick={handleBecomeMember}
      />
    </div>
  );
}

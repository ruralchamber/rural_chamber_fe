"use client";

import ProfileSection from "@/components/about/ProfileSection";
import { HeroSection } from "@/components/common/HeroSection";
import { CTAParallaxSection } from "@/components/home/CTAParallexSection";
import { OurServices } from "@/components/services/OurServices";
import React from "react";
import { useRouter } from "next/navigation";

export default function ServicesPage() {
  const router = useRouter();

  const handleBecomeMember = () => {
    router.push("/membership");
  };

  return (
    <div>
      <HeroSection
        backgroundImage="/services/hero.png"
        title="What We Do"
        tagline="A few words about"
        ctaButtons={[]}
      />

      <OurServices />
      <CTAParallaxSection
        backgroundImage="/services/money.png"
        title="Become a member today and help build thriving rural communities!"
        buttonText="Become a Member"
        onButtonClick={handleBecomeMember} 
      />
    </div>
  );
}
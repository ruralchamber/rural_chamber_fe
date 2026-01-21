'use client'

import { HeroSection } from "@/components/common/HeroSection";
import { CTAParallaxSection } from "@/components/home/CTAParallexSection";
import MembershipPricing from "@/components/membership/Membership";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page() {
  const router = useRouter();

  const handleBecomeMemberClick = () => {
    router.push("/auth/signup");
  };

  return (
    <div>
      <HeroSection
        backgroundImage="/member/hero.png"
        title="Membership"
        tagline="Join Us Today"
        ctaButtons={[]}
      />
      <MembershipPricing/>
      <CTAParallaxSection
        backgroundImage="/services/money.png"
        title="Become a member today and help build thriving rural communities!"
        buttonText="Become a Member"
        onButtonClick={handleBecomeMemberClick}
      />
    </div>
  );
}
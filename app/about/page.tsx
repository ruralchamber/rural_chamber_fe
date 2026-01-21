"use client";

import AboutFounder from "@/components/about/AboutFounder";
import {
  MembershipData,
  MembershipProcess,
} from "@/components/about/MembershipProcess";
import OurPartners from "@/components/about/OurPartners";
import VisionMissionObjectives from "@/components/about/VissionMission";
import { HeroSection } from "@/components/common/HeroSection";
import { ContentSection } from "@/components/home/ContentSectionParagraph";
import { CTAParallaxSection } from "@/components/home/CTAParallexSection";
import React from "react";
import { useRouter } from "next/navigation";
import ImpactBenefits from "@/components/about/ImpactBenefits";

export default function AboutPage() {
  const router = useRouter();

  
  const handleGetInTouch = () => {
    router.push("/contact-us");
  };

  const handleBecomeMember = () => {
    router.push("/membership");
  };

  const handleReadMore = () => {
    
    router.push("/services");

  };

  return (
    <div>
      <HeroSection
        backgroundImage="/about/hero.png"
        title="About Us"
        ctaButtons={[
          {
            text: "Get in touch",
            onClick: handleGetInTouch, 
            variant: "primary",
          },
        ]}
      />

      <div>
        <ContentSection
          title="History"
          description="Established to address the economic challenges in South Africa's rural areas, fostering growth, creating opportunities, and empowering communities to thrive."
          buttonText="Read More" 
          onButtonClick={handleReadMore} 
        />
      </div>

      <div className="min-h-screen bg-white py-12">
        <MembershipProcess steps={MembershipData} />
      </div>

      <div>
        <ImpactBenefits />
      </div>

      <div>
        <OurPartners />
      </div>

      <div>
        <CTAParallaxSection
          backgroundImage="/home/trees.png"
          title="Become a member today and help build thriving rural communities!"
          buttonText="Become a Member"
          onButtonClick={handleBecomeMember} 
        />
      </div>
    </div>
  );
}
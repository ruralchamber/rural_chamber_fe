"use client";

import { HeroSection } from "@/components/common/HeroSection";
import ContactUsPage from "@/components/contact/ContactUs";
import { CTAParallaxSection } from "@/components/home/CTAParallexSection";
import React from "react";

export default function page() {
  return (
    <div>
      <HeroSection
        backgroundImage="/contact.jpg"
        title="Contact us"
        tagline="Get in Touch"
        ctaButtons={[]}
      />

      <div className="bg-white">
        <ContactUsPage />
      </div>

      <CTAParallaxSection
        backgroundImage="/services/money.png"
        title="Become a member today and help build thriving rural communities!"
        buttonText="Become a Member"
        onButtonClick={() => console.log("Become a Member clicked")}
      />
    </div>
  );
}

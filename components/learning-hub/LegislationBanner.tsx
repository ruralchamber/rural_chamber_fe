"use client";

import React from "react";
import { HeroSection } from "../common/HeroSection";
import FarmingLegislation from "./Legislation";

export default function LegislationBanner() {
  return (
    <div>
      <HeroSection
        backgroundImage="/legislation.png"
        title={`Know Your${String.fromCharCode(10)}Farming Rights`}
        subtitle="Farming laws protect your land, crops, animals, and business. From land use to food safety, water rights, and trade regulations, knowing the rules helps you grow with confidence."
        ctaButtons={[]}
      />
      <FarmingLegislation />
    </div>
  );
}
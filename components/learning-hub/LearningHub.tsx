"use client";

import React from "react";
import { HeroSection } from "../common/HeroSection";
import ConnectHub from "./Connect/ConnectHub";

export default function LearningHub() {
  return (
    <div>
      <HeroSection
        backgroundImage="/hub.png"
        title=" Connect Hub"
        subtitle="Network, discover opportunities, and grow your business with fellow members"
        ctaButtons={[
          
        ]}
      />

      <ConnectHub/>
    </div>
  );
}

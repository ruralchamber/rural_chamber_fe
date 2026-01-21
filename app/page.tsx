"use client";

import { HeroSection } from "@/components/common/HeroSection";
import { ContentSection } from "@/components/home/ContentSectionParagraph";
import { CTAParallaxSection } from "@/components/home/CTAParallexSection";
import MembershipAndPartners from "@/components/home/MembershipAndPartner";
import { MembershipBenefits } from "@/components/home/MembershipBenefits";
import { ObjectivesSection } from "@/components/home/ObjectiveSectionCard";
import UpcomingEvent from "@/components/home/UpcomingEvent";
import React from "react";
import MembershipPricing from "@/components/home/MembershipPricing";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const objectives = [
    {
      image: "/home/objective1.png",
      title: "Promote rural economic development",
      description:
        "Support the growth of rural businesses, create jobs, and stimulate local economies.",
      borderImage: "/Divider.png",
    },
    {
      image: "/home/objective2.png",
      title: "Provide business support services",
      description:
        "Offer training, mentorship, and advisory services to rural entrepreneurs and businesses.",
      borderImage: "/Divider.png",
    },
    {
      image: "/home/objective3.png",
      title: "Advocate for rural business interests",
      description:
        "Represent the interests of rural businesses at local, provincial, and national levels.",
      borderImage: "/Divider.png",
    },
    {
      image: "/home/objective4.png",
      title: "Foster partnerships and collaborations",
      description:
        "Build relationships with government, NGOs, and private sector organizations to support rural development.",
      borderImage: "/Divider.png",
    },
    {
      image: "/home/objective5.png",
      title: "Develop rural entrepreneurship",
      description:
        "Encourage and support entrepreneurship in rural areas, particularly among youth and women.",
      borderImage: "/Divider.png",
    },
  ];


  const handleJoinUs = () => {
    router.push("/auth/signup"); 
  };

  const handleLearnMore = () => {
    router.push("/about"); 
  };

  const handleReadMore = () => {
    router.push("/about"); 
  };

  const handleBecomeMember = () => {
    router.push("/membership"); 
  };

  return (
    <div>
      <div className="w-full">
        <HeroSection
          backgroundImage="/home/hero.png"
          tagline="Unlocking Opportunities | Driving Growth | Transforming Lives"
          title="Empowering Rural South Africa: Building Thriving Business Communities"
          subtitle="Join us in fostering innovation, entrepreneurship, and sustainable development in South Africa's rural areas. Together, we can create a future of economic prosperity and upliftment for all."
          ctaButtons={[
            {
              text: "Join Us",
              variant: "primary",
              onClick: handleJoinUs, 
            },
            {
              text: "Learn more",
              variant: "secondary", 
              onClick: handleLearnMore, 
            },
          ]}
        />
      </div>
      <div>
        <ContentSection
          title="Empowering Rural Communities for a Prosperous Future"
          description="The Rural Chamber of Commerce and Industry is dedicated to empowering South Africa's rural communities by promoting economic growth, entrepreneurship, and sustainable development. Through advocacy, training, business support services, and networking opportunities, we strive to create a vibrant business ecosystem that drives job creation, reduces poverty, and unlocks the potential of rural industries. Together, we are shaping a prosperous future for rural South Africa."
          buttonText="Read More"
          onButtonClick={handleReadMore} 
        />
      </div>

      <div>
        <ObjectivesSection objectives={objectives} />
      </div>

      <div>
        <CTAParallaxSection
          backgroundImage="/home/trees.png"
          title="Join the Rural Chamber of Commerce Today – Unlock Opportunities for Growth!"
          buttonText="Become a Member"
          onButtonClick={handleBecomeMember}
        />
      </div>

      <div>
        <MembershipBenefits
          sectionTitle="Why Become a Member of the Rural Chamber? Rural Chamber of Commerce!"
          objectives={[
            {
              image: "/home/Icon.png",
              title: "Networking Opportunities:",
              description:
                "Connect with like-minded entrepreneurs, business leaders, and industry experts to grow your network and explore collaboration opportunities.",
              borderImage: "/Divider.png",
            },
            {
              image: "/home/Icon.png",
              title: "Business Training & Workshops:",
              description:
                "Gain practical skills and insights through tailored workshops and training sessions designed to enhance your business success.",
              borderImage: "/Divider.png",
            },
            {
              image: "/home/Icon.png",
              title: "Access to Market Research & Data:",
              description:
                "Stay ahead with exclusive access to industry data, market trends, and research to inform your decisions.",
              borderImage: "/Divider.png",
            },
            {
              image: "/home/Icon.png",
              title: "Advocacy & Policy Influence:",
              description:
                "Have your voice heard on key issues affecting rural businesses and contribute to shaping policies that drive growth.",
              borderImage: "/Divider.png",
            },
            {
              image: "/home/Icon.png",
              title: "Exclusive Discounts & Promotions:",
              description:
                "Enjoy special deals and savings on services, events, and resources available only to our members.",
              borderImage: "/Divider.png",
            },
            {
              image: "/home/Icon.png",
              title: "Business Support & Visibility:",
              description:
                "Gain support promoting your business across our network, events, website, and community initiatives.",
              borderImage: "/Divider.png",
            },
          ]}
          backgroundColor="bg-white"
        />

        <MembershipAndPartners />
      </div>

      <div>
        <CTAParallaxSection
          backgroundImage="/home/trees.png"
          title="Become a member today and help build thriving rural communities!"
          buttonText="Become a Member"
          onButtonClick={handleBecomeMember} 
        />
      </div>

      <div className="bg-white">
        <UpcomingEvent />
      </div>
      <MembershipPricing />
    </div>
  );
}
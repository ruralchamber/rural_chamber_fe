"use client";

import { HeroSection } from "@/components/common/HeroSection";
import EventCard from "@/components/Events/EventsCard";
import { CTAParallaxSection } from "@/components/home/CTAParallexSection";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EVENTS_API, EventResponse } from "@/app/api/endpoints/rest-api/events/events";
import { useToast } from "@/components/common/Toast";

export default function EventsPage() {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicEvents();
  }, []);

  const fetchPublicEvents = async () => {
    try {
      setLoading(true);
      const response = await EVENTS_API.GET_PUBLIC_EVENTS();
      
      if (response.error) {
        showToast(response.message || "Failed to load events", 'error');
      } else {
        const publicEvents = (response.data || []).filter(
          (event) => event.isVisible && event.status === "upcoming"
        );
        setEvents(publicEvents);
      }
    } catch (err: any) {
      console.error("Error fetching public events:", err);
      showToast("Failed to load events. Please try again later.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeMember = () => {
    router.push("/membership");
  };

  const handleEventClick = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <div>
      <ToastContainer />
      
      <HeroSection
        backgroundImage="/services/hero.png"
        title="Events"
        tagline="Participate in our"
        ctaButtons={[]}
      />
      
      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[#01311B] mb-4">
                No Events Available Yet
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Stay tuned! Exciting events are coming soon to support and connect our rural business community.
              </p>
              <button
                onClick={handleBecomeMember}
                className="px-8 py-3 bg-[#9FC93B] text-white rounded-lg hover:bg-[#8AB82F] font-medium transition-colors"
              >
                Become a Member
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-center text-[#01311B] mb-10 text-2xl font-semibold">
                Upcoming Events - Free for Everyone
              </h2>
              <div className="grid md:grid-cols-2 gap-10">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    month={event.month}
                    day={event.day}
                    image={event.image}
                    title={event.title}
                    description={event.description}
                    onClick={() => handleEventClick(event.id)}
                  />
                ))}
              </div>
              
              <div className="mt-12 text-center bg-linear-to-r from-green-50 to-blue-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Want Access to Premium Events?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Join as a member to unlock exclusive events, networking opportunities, and member-only benefits designed to grow your rural business.
                </p>
                <button
                  onClick={handleBecomeMember}
                  className="px-8 py-3 bg-[#9FC93B] text-white rounded-lg hover:bg-[#8AB82F] font-medium transition-colors shadow-md hover:shadow-lg"
                >
                  Explore Membership Plans
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <CTAParallaxSection
        backgroundImage="/services/money.png"
        title="Become a member today and help build thriving rural communities!"
        buttonText="Become a Member"
        onButtonClick={handleBecomeMember}
      />
    </div>
  );
}
"use client";

import { HeroSection } from "@/components/common/HeroSection";
import EventCard from "@/components/Events/EventsCard";
import { CTAParallaxSection } from "@/components/home/CTAParallexSection";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EVENTS_API, EventResponse } from "@/app/api/endpoints/rest-api/events/events";
import { useToast } from "@/components/common/Toast";
import EventModalPublic from "@/components/Events/EventsModal";

export default function EventsPage() {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

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
        // Only show visible upcoming events that are available to free users
        const publicEvents = (response.data || []).filter(
          (event) => 
            event.isVisible && 
            event.status === "upcoming" &&
            (event.subscriptionTiers?.includes('free') || false) // Only show free events
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

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleSignup = () => {
    router.push("/auth/signup");
  };

  const handleEventClick = (event: EventResponse) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleJoinNow = () => {
    if (selectedEvent?.subscriptionTiers?.includes('free')) {
      // For free events, go to login/signup
      router.push("/auth/login");
    } else {
      // For members-only events, go to membership
      router.push("/membership");
    }
    setShowEventModal(false);
  };

  // Sort events by date (most recent first)
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      {/* Event Modal for Public Users */}
      <EventModalPublic
        event={selectedEvent}
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onJoinNow={handleJoinNow}
      />
      
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
              <p className="ml-4 text-gray-600">Loading events...</p>
            </div>
          ) : sortedEvents.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[#01311B] mb-4">
                No Public Events Available
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                There are currently no upcoming public events. Check back soon or join as a member to access exclusive events.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleBecomeMember}
                  className="px-6 py-3 bg-gradient-to-r from-[#01311B] to-[#024d2f] text-white rounded-lg hover:opacity-90 font-medium transition-colors"
                >
                  Explore Membership
                </button>
                <button
                  onClick={handleLogin}
                  className="px-6 py-3 bg-white border border-[#9FC93B] text-[#9FC93B] rounded-lg hover:bg-green-50 font-medium transition-colors"
                >
                  Member Login
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[#01311B] mb-3">
                  Upcoming Public Events
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Free events open to everyone. Click on any event to view details and learn more.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {sortedEvents.length} Event{sortedEvents.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {sortedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    month={event.month}
                    day={event.day}
                    image={event.image}
                    title={event.title}
                    description={event.description}
                    onClick={() => handleEventClick(event)}
                    showReadMore={true}
                    maxDescriptionLength={100}
                  />
                ))}
              </div>
              
              {/* Stats and CTA */}
              <div className="mt-12 grid md:grid-cols-2 gap-8">
                {/* Stats Card */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Event Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                    
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Attendees</span>
                      <span className="font-bold text-[#01311B]">
                        {sortedEvents.reduce((total, event) => total + (event.attendees || 0), 0)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* CTA Card */}
                <div className="bg-gradient-to-r from-[#01311B] to-[#024d2f] text-white rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-3">Want More Events?</h3>
                  <p className="text-green-100 mb-4">
                    Join as a member to unlock exclusive events, premium content, and networking opportunities.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleBecomeMember}
                      className="px-5 py-2.5 bg-white text-[#01311B] rounded-lg hover:bg-gray-100 font-medium transition-colors"
                    >
                      View Membership Plans
                    </button>
                    <button
                      onClick={handleLogin}
                      className="px-5 py-2.5 bg-transparent border border-white text-white rounded-lg hover:bg-white/10 font-medium transition-colors"
                    >
                      Existing Member Login
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Bottom CTA */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">
                  Not sure which membership is right for you?
                </p>
                <button
                  onClick={() => router.push('/membership/compare')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#9FC93B] text-white rounded-lg hover:bg-[#8AB82F] font-medium transition-colors shadow-md hover:shadow-lg"
                >
                  Compare Membership Plans
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <CTAParallaxSection
        backgroundImage="/services/money.png"
        title="Become a member today and help build thriving rural communities!"
        buttonText="Explore Membership"
        onButtonClick={handleBecomeMember}
      />
    </div>
  );
}
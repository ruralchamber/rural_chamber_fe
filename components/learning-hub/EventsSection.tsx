"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Search, ArrowLeft, AlertCircle, CheckCircle, XCircle, Building2 } from 'lucide-react';
import { EVENTS_API, EventResponse } from "@/app/api/endpoints/rest-api/events/events";
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/common/Toast";
import { motion } from 'framer-motion';

export default function EventsLoggedIn() {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Events');
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [showRegistrationAlert, setShowRegistrationAlert] = useState(false);

  useEffect(() => {
    fetchUserEvents();
    fetchUserRegistrations();
  }, []);

  const fetchUserEvents = async () => {
    try {
      setLoading(true);
      const response = await EVENTS_API.GET_USER_EVENTS();
      
      if (response.error) {
        if (response.status === 401) {
          showToast("Please login to view events", 'error');
          router.push('/auth/login');
        } else {
          showToast(response.message || "Failed to load events", 'error');
        }
      } else {
        setEvents(response.data || []);
      }
    } catch (err: any) {
      console.error("Error fetching user events:", err);
      showToast("Failed to load events. Please try again later.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      const response = await EVENTS_API.GET_USER_REGISTRATIONS();
      if (!response.error && response.data) {
        setUserRegistrations(response.data);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  const filters = ['All Events', 'upcoming', 'past', 'Conference', 'Workshop', 'Seminar', 'Expo'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter !== 'All Events') {
      const filterLower = selectedFilter.toLowerCase();
      matchesFilter = event.status === filterLower || event.category === selectedFilter;
    }
    
    return matchesSearch && matchesFilter;
  });

  const isUserRegistered = (eventId: number): boolean => {
    return userRegistrations.some(reg => 
      reg.eventId === eventId && reg.status === 'confirmed'
    );
  };

  const getUserRegistrationId = (eventId: number): number | null => {
    const registration = userRegistrations.find(reg => 
      reg.eventId === eventId && reg.status === 'confirmed'
    );
    return registration ? registration.id : null;
  };

  const handleRegister = async (eventId: number) => {
    try {
      setRegistering(eventId);
      const response = await EVENTS_API.REGISTER_FOR_EVENT(eventId);
      
      if (response.error) {
        if (response.status === 400 && response.message?.includes("complete your profile")) {
          showToast("Please complete your profile registration first", 'warning');
          setShowRegistrationAlert(true);
          setTimeout(() => {
            router.push('/membership');
          }, 2000);
          return;
        }
        
        if (response.status === 401) {
          showToast("Please login to register", 'error');
          router.push('/auth/login');
        } else if (response.status === 409) {
          showToast("You are already registered for this event", 'warning');
          await fetchUserRegistrations(); 
        } else if (response.status === 400) {
          showToast(response.message || "Event is not available for registration", 'warning');
        } else {
          showToast(response.message || "Failed to register for event", 'error');
        }
      } else {
        showToast("Successfully registered for event! Check your email for confirmation.", 'success');
        await fetchUserRegistrations(); 
        await fetchUserEvents(); 
      }
    } catch (err: any) {
      console.error("Error registering for event:", err);
      
      if (err.status === 400) {
        showToast("Please complete your profile registration first", 'warning');
        setShowRegistrationAlert(true);
        setTimeout(() => {
          router.push('/membership');
        }, 2000);
      } else {
        showToast("Failed to register for event. Please try again.", 'error');
      }
    } finally {
      setRegistering(null);
    }
  };

  const handleCancelRegistration = async (eventId: number) => {
    try {
      setCancelling(eventId);
      const registrationId = getUserRegistrationId(eventId);
      
      if (!registrationId) {
        showToast("Registration not found", 'error');
        return;
      }

      const response = await EVENTS_API.CANCEL_EVENT_REGISTRATION(registrationId);
      
      if (response.error) {
        showToast(response.message || "Failed to cancel registration", 'error');
      } else {
        showToast("Registration cancelled successfully", 'success');
        await fetchUserRegistrations(); 
        await fetchUserEvents(); 
      }
    } catch (err: any) {
      console.error("Error cancelling registration:", err);
      showToast("Failed to cancel registration. Please try again.", 'error');
    } finally {
      setCancelling(null);
    }
  };

  const handleViewDetails = (eventId: number) => {
    // router.push(`/events/${eventId}`);
  };

  const isEventFull = (event: EventResponse): boolean => {
    return !!(event.maxAttendees && event.attendees >= event.maxAttendees);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#9FC93B]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-[#9FC93B] animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      {showRegistrationAlert && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please complete your profile registration to register for events.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-linear-to-r from-[#01311B] to-[#024d2f] text-white py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Calendar className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Rural Chamber Events
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Discover and register for exclusive events designed to grow your business. 
              Network with industry leaders and gain valuable insights.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
        
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedFilter === filter
                        ? 'bg-[#9FC93B] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.map((event) => {
              const eventFull = isEventFull(event);
              const registered = isUserRegistered(event.id);
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-linear-to-br from-green-100 to-green-200 relative cursor-pointer"
                       onClick={() => handleViewDetails(event.id)}>
                    {event.image && (event.image.startsWith('http') || event.image.startsWith('/') || event.image.startsWith('data:')) ? (
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-green-600 opacity-30" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.status === 'upcoming' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-500 text-white'
                      }`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-[#F5F9E8] text-[#9FC93B] rounded-full text-xs font-semibold mb-2">
                        {event.category}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-[#9FC93B]"
                          onClick={() => handleViewDetails(event.id)}>
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {event.description}
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-[#9FC93B]" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-[#9FC93B]" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-[#9FC93B]" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-[#9FC93B]" />
                        <span>{event.attendees} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''} attendees</span>
                        {eventFull && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                            Full
                          </span>
                        )}
                      </div>
                    </div>

                    {registered && (
                      <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center text-green-700">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          <span className="font-medium">You are registered for this event</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {event.status === 'upcoming' && !eventFull && (
                        <button 
                          onClick={() => registered 
                            ? handleCancelRegistration(event.id)
                            : handleRegister(event.id)
                          }
                          disabled={registering === event.id || cancelling === event.id}
                          className={`flex-1 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                            registered
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-[#9FC93B] text-white hover:bg-[#8AB82F]'
                          }`}
                        >
                          {cancelling === event.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                              Cancelling...
                            </>
                          ) : registering === event.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Registering...
                            </>
                          ) : registered ? (
                            <>
                              <XCircle className="w-4 h-4" />
                              Cancel Registration
                            </>
                          ) : (
                            'Register Now'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
            >
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedFilter !== 'All Events' 
                  ? 'Try adjusting your search or filters' 
                  : 'No events available for your membership tier'}
              </p>
              {(searchTerm || selectedFilter !== 'All Events') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedFilter('All Events');
                  }}
                  className="px-6 py-2 bg-[#9FC93B] text-white rounded-lg hover:bg-[#8AB82F] transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
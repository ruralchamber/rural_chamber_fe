"use client";

import React, { useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, Image as ImageIcon, Lock, ArrowRight } from 'lucide-react';
import { EventResponse } from "@/app/api/endpoints/rest-api/events/events";

interface EventModalPublicProps {
  event: EventResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onJoinNow?: () => void;
}

export default function EventModalPublic({
  event,
  isOpen,
  onClose,
  onJoinNow
}: EventModalPublicProps) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  const isEventFull = !!(event.maxAttendees && event.attendees >= event.maxAttendees);
  
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'upcoming': return 'bg-green-500';
      case 'past': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('en-ZA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString || timeString === 'To be confirmed') return timeString;
    
    try {
      if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes || '0'));
        return date.toLocaleTimeString('en-ZA', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return timeString;
    } catch (error) {
      return timeString;
    }
  };

  const isValidImage = event.image && (
    event.image.startsWith('http') || 
    event.image.startsWith('https') || 
    event.image.startsWith('data:image') ||
    event.image.startsWith('/')
  );

  // Check if event is available for free users
  const isFreeEvent = event.subscriptionTiers?.includes('free') || false;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-[100] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 
                  id="event-modal-title"
                  className="text-2xl font-bold text-gray-900 line-clamp-2"
                >
                  {event.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white whitespace-nowrap shrink-0 ${getStatusColor(event.status)}`}>
                    {getStatusText(event.status)}
                  </span>
                  {!isFreeEvent && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 whitespace-nowrap shrink-0">
                      <Lock className="w-3 h-3 inline mr-1" />
                      Members Only
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block px-3 py-1 bg-[#F5F9E8] text-[#9FC93B] rounded-full text-sm font-semibold">
                  {event.category || 'General'}
                </span>
                {isFreeEvent && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    Free Access
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors shrink-0"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Event Image */}
          <div className="relative h-64 bg-gradient-to-br from-green-50 to-blue-50">
            {isValidImage ? (
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.className = "w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50";
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8">
                <ImageIcon className="w-16 h-16 text-green-300 mb-4" />
                <p className="text-gray-400 text-center">No image available</p>
              </div>
            )}
          </div>

          <div className="p-6">
            {/* Description */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">About This Event</h4>
              <div className="prose prose-green max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {event.description || 'No description available.'}
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Event Information</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#9FC93B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#9FC93B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium text-gray-900">{formatTime(event.time)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#9FC93B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{event.location || 'To be confirmed'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Attendance & Access</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-[#9FC93B] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Attendees</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">
                              {event.attendees || 0} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''}
                            </p>
                            {isEventFull ? (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                Fully Booked
                              </span>
                            ) : (
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                                {event.maxAttendees ? `${event.maxAttendees - (event.attendees || 0)} spots left` : 'Open'}
                              </span>
                            )}
                          </div>
                          {event.maxAttendees && (
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#9FC93B] h-2 rounded-full"
                                style={{ 
                                  width: `${Math.min(100, ((event.attendees || 0) / event.maxAttendees) * 100)}%` 
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subscription Tiers */}
                  {event.subscriptionTiers && event.subscriptionTiers.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Available For</p>
                      <div className="flex flex-wrap gap-2">
                        {event.subscriptionTiers.map((tier) => (
                          <span 
                            key={tier} 
                            className={`px-3 py-1.5 text-xs rounded-full font-medium ${
                              tier === 'free' 
                                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                                : tier.includes('gold')
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                : tier.includes('platinum')
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : tier.includes('silver')
                                ? 'bg-gray-100 text-gray-800 border border-gray-200'
                                : 'bg-green-100 text-green-800 border border-green-200'
                            }`}
                          >
                            {tier === 'free' ? 'Public Access' : (
                              <span className="flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                {tier.split('_').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')} Members
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Membership CTA */}
            {!isFreeEvent && (
              <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-100 p-3 rounded-full shrink-0">
                    <Lock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">This is a Members-Only Event</h4>
                    <p className="text-gray-700 mb-3">
                      Join our membership program to access exclusive events like this one. 
                      Members get priority registration, networking opportunities, and special rates.
                    </p>
                    <button
                      onClick={onJoinNow}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#01311B] to-[#024d2f] text-white rounded-lg hover:opacity-90 font-medium transition-all shadow-md hover:shadow-lg"
                    >
                      Join Now to Register
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* General CTA for free events */}
            {isFreeEvent && event.status === 'upcoming' && !isEventFull && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full shrink-0">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Want to Register for This Event?</h4>
                    <p className="text-gray-700 mb-3">
                      This event is open to the public! Create an account or login to register and secure your spot.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => onJoinNow && onJoinNow()}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#9FC93B] to-[#8AB82F] text-white rounded-lg hover:opacity-90 font-medium transition-all"
                      >
                        Login to Register
                      </button>
                      <button
                        onClick={() => onJoinNow && onJoinNow()}
                        className="px-5 py-2.5 bg-white border border-[#9FC93B] text-[#9FC93B] rounded-lg hover:bg-green-50 font-medium transition-all"
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-full shrink-0">
                  <ImageIcon className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Need help or have questions? Contact our events team at events@ruralchamber.co.za
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Close Details
            </button>
            
            {onJoinNow && (
              <button
                onClick={onJoinNow}
                className="px-6 py-3 bg-gradient-to-r from-[#01311B] to-[#024d2f] text-white rounded-lg hover:opacity-90 font-medium transition-all shadow-md hover:shadow-lg flex-1 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {isFreeEvent ? 'Login to Register' : 'Join Membership to Access'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
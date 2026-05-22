"use client";

import React from 'react';
import { X, Calendar, Clock, MapPin, Users, Tag, Image as ImageIcon } from 'lucide-react';
import { EventResponse } from "@/app/api/endpoints/rest-api/events/events";

interface EventModalProps {
  event: EventResponse | null;
  isOpen: boolean;
  onClose: () => void;
  isUserRegistered?: boolean;
  onRegister?: () => void;
  onCancelRegistration?: () => void;
  isRegistering?: boolean;
  isCancelling?: boolean;
}

export default function EventModal({
  event,
  isOpen,
  onClose,
  isUserRegistered = false,
  onRegister,
  onCancelRegistration,
  isRegistering = false,
  isCancelling = false
}: EventModalProps) {
  if (!isOpen || !event) return null;

  const isEventFull = !!(event.maxAttendees && event.attendees >= event.maxAttendees);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-green-500';
      case 'past': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0  bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
       
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-gray-900 line-clamp-1">
                {event.title}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(event.status)}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
          <div className="mt-2">
            <span className="inline-block px-3 py-1 bg-[#F5F9E8] text-[#9FC93B] rounded-full text-sm font-semibold">
              {event.category}
            </span>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          
          <div className="h-64 rounded-lg overflow-hidden mb-6 bg-linear-to-br from-green-100 to-green-200">
            {event.image && (event.image.startsWith('http') || event.image.startsWith('/') || event.image.startsWith('data:')) ? (
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-green-600 opacity-30" />
              </div>
            )}
          </div>

          <div className="space-y-6">
           
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Event Description</h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Event Information</h4>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#9FC93B] shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#9FC93B] shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#9FC93B] shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Attendance</h4>
                
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#9FC93B] shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Attendees</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {event.attendees} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''}
                      </p>
                      {isEventFull && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                          Full
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {event.subscriptionTiers && event.subscriptionTiers.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Available For</p>
                    <div className="flex flex-wrap gap-2">
                      {event.subscriptionTiers.map((tier) => (
                        <span 
                          key={tier} 
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium"
                        >
                          {tier.charAt(0).toUpperCase() + tier.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          {isUserRegistered ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-green-600">
                <span className="text-sm font-medium">You are registered for this event</span>
              </div>
              <button 
                onClick={onCancelRegistration}
                disabled={isCancelling}
                className="px-6 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Cancelling...
                  </>
                ) : (
                  'Cancel Registration'
                )}
              </button>
            </div>
          ) : event.status === 'upcoming' && !isEventFull ? (
            <button 
              onClick={onRegister}
              disabled={isRegistering}
              className="w-full py-3 bg-[#9FC93B] text-white rounded-lg hover:bg-[#8AB82F] font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isRegistering ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Registering...
                </>
              ) : (
                'Register Now'
              )}
            </button>
          ) : isEventFull ? (
            <div className="text-center py-2">
              <p className="text-red-600 font-medium">This event is fully booked</p>
            </div>
          ) : event.status !== 'upcoming' ? (
            <div className="text-center py-2">
              <p className="text-gray-600 font-medium">This event has ended</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, Calendar, Clock, MapPin, Users, UserCheck, ExternalLink } from 'lucide-react';
import { Event, subscriptionTiers } from '@/app/types/events/events.types';
import { EVENTS_API } from '@/app/api/endpoints/rest-api/events/events';
import { useToast } from '@/components/common/Toast';
import RegisteredUsersModal from './RegisteredUsersModal';

interface EventListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

export default function EventList({ events, onEdit, onDelete, onToggleVisibility }: EventListProps) {
  const { showToast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<{ id: number; title: string } | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  const handleViewRegistrations = async (eventId: number, eventTitle: string) => {
    try {
      setLoadingRegistrations(true);
      setSelectedEvent({ id: eventId, title: eventTitle });
      
      const response = await EVENTS_API.GET_EVENT_REGISTRATIONS_ADMIN(eventId);
      if (response.error) {
        showToast(response.message || 'Failed to load registrations', 'error');
      } else {
        setRegistrations(response.data || []);
      }
    } catch (error) {
      console.error('Error loading registrations:', error);
      showToast('Failed to load registrations', 'error');
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const closeRegistrationsModal = () => {
    setSelectedEvent(null);
    setRegistrations([]);
  };

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
        <p className="text-gray-600">Create your first event to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
           
            <div className="h-48 relative">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-green-600 opacity-30" />
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.status === 'Upcoming' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                  {event.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.isVisible ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}>
                  {event.isVisible ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-[#F5F9E8] text-[#9FC93B] rounded-full text-xs font-semibold">
                  {event.category}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

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
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {event.subscriptionTiers.map((tier) => (
                  <span key={tier} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {subscriptionTiers.find(t => t.value === tier)?.label}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => handleViewRegistrations(parseInt(event.id), event.title)}
                  disabled={loadingRegistrations}
                  className="flex-1 py-2 text-purple-600 hover:bg-purple-50 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingRegistrations ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  ) : (
                    <UserCheck size={16} />
                  )}
                  Registrations
                </button>
                <button
                  onClick={() => onToggleVisibility(event.id)}
                  className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-2"
                >
                  {event.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  {event.isVisible ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => onEdit(event)}
                  className="flex-1 py-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(event.id)}
                  className="flex-1 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <RegisteredUsersModal
          type="event"
          itemId={selectedEvent.id}
          itemTitle={selectedEvent.title}
          registrations={registrations}
          onClose={closeRegistrationsModal}
        />
      )}
    </>
  );
}
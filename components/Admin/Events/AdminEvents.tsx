"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Plane, Download, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EventModal from './EventsModal'; 
import EventList from './EventsList';
import TripModal from './TripsModal'; 
import TripList from './TripsList';
import { EVENTS_API, EventResponse, TripResponse, CreateEventData, CreateTripData } from '@/app/api/endpoints/rest-api/events/events';
import { useToast } from '@/components/common/Toast';
import { SubscriptionTier } from '@/app/types/events/events.types';

const convertEventResponseToFormEvent = (event: EventResponse) => {
  const statusMap: Record<string, 'Upcoming' | 'Past'> = {
    'upcoming': 'Upcoming',
    'past': 'Past',
    'cancelled': 'Past'
  };

  return {
    id: event.id.toString(),
    title: event.title,
    description: event.description,
    category: event.category,
    date: event.date,
    time: event.time,
    location: event.location,
    attendees: event.attendees,
    maxAttendees: event.maxAttendees,
    registeredAttendees: event.registeredAttendees || 0,
    capacity: event.capacity || event.maxAttendees || event.attendees,
    status: statusMap[event.status] || 'Upcoming',
    subscriptionTiers: event.subscriptionTiers as SubscriptionTier[],
    isVisible: event.isVisible,
    image: event.image,
    month: event.month,
    day: event.day,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt
  };
};

const convertEventResponseArrayToFormEvents = (events: EventResponse[]) => 
  events.map(convertEventResponseToFormEvent);

const convertTripResponseToFormTrip = (trip: TripResponse) => ({
  id: trip.id.toString(),
  title: trip.title,
  destination: trip.destination,
  dates: trip.dates,
  time: trip.time,
  regularPrice: trip.regularPrice,
  memberPrice: trip.memberPrice,
  discount: trip.discount,
  imageUrl: trip.imageUrl,
  availableSlots: trip.availableSlots,
  bookedSlots: trip.bookedSlots || 0,
  category: trip.category,
  description: trip.description,
  subscriptionTiers: trip.subscriptionTiers as SubscriptionTier[],
  isVisible: trip.isVisible,
  createdAt: trip.createdAt
});

const convertTripResponseArrayToFormTrips = (trips: TripResponse[]) =>
  trips.map(convertTripResponseToFormTrip);

const convertToBackendEvent = (event: any): CreateEventData => {
  const statusMap: Record<string, 'upcoming' | 'past'> = {
    'Upcoming': 'upcoming',
    'Past': 'past',
    'upcoming': 'upcoming',
    'past': 'past'
  };

  return {
    title: event.title,
    description: event.description,
    category: event.category,
    date: event.date,
    time: event.time,
    location: event.location,
    attendees: typeof event.attendees === 'number' ? event.attendees : parseInt(event.attendees) || 0,
    maxAttendees: event.maxAttendees ? (typeof event.maxAttendees === 'number' ? event.maxAttendees : parseInt(event.maxAttendees)) : undefined,
    status: statusMap[event.status] || 'upcoming',
    subscriptionTiers: event.subscriptionTiers || ['free'],
    isVisible: event.isVisible !== false,
    image: event.image || '',
    month: event.month || 'JAN',
    day: typeof event.day === 'number' ? event.day : parseInt(event.day) || 1,
  };
};

const convertToBackendTrip = (trip: any): CreateTripData => ({
  title: trip.title,
  destination: trip.destination,
  dates: trip.dates,
  time: trip.time || 'All Day',
  regularPrice: typeof trip.regularPrice === 'number' ? trip.regularPrice : parseFloat(trip.regularPrice) || 0,
  memberPrice: typeof trip.memberPrice === 'number' ? trip.memberPrice : parseFloat(trip.memberPrice) || 0,
  discount: typeof trip.discount === 'number' ? trip.discount : parseFloat(trip.discount) || 0,
  imageUrl: trip.imageUrl || '',
  availableSlots: typeof trip.availableSlots === 'number' ? trip.availableSlots : parseInt(trip.availableSlots) || 0,
  category: trip.category || 'Business',
  description: trip.description,
  subscriptionTiers: trip.subscriptionTiers || [],
  isVisible: trip.isVisible !== false,
});

export default function AdminEventsTripsManager() {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [activeTab, setActiveTab] = useState<'events' | 'trips'>('events');
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventResponse | null>(null);
  const [editingTrip, setEditingTrip] = useState<TripResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'events') {
        const response = await EVENTS_API.GET_ALL_EVENTS_ADMIN();
        if (response.error) {
          if (response.status === 401 || response.status === 403) {
            showToast('Admin access required. Please login.', 'error');
            router.push('/auth/login');
          } else {
            showToast(response.message || 'Failed to load events', 'error');
          }
        } else {
          setEvents(response.data || []);
        }
      } else {
        const response = await EVENTS_API.GET_ALL_TRIPS_ADMIN();
        if (response.error) {
          if (response.status === 401 || response.status === 403) {
            showToast('Admin access required. Please login.', 'error');
            router.push('/auth/login');
          } else {
            showToast(response.message || 'Failed to load trips', 'error');
          }
        } else {
          setTrips(response.data || []);
        }
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      showToast('Failed to load data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (data: any) => {
    try {
      if (!data.title || !data.description || !data.location) {
        showToast('Please fill in all required fields', 'warning');
        return;
      }

      const eventData = convertToBackendEvent(data);
      const response = await EVENTS_API.CREATE_EVENT(eventData);
      
      if (response.error) {
        showToast(response.message || 'Failed to create event', 'error');
      } else {
        showToast('Event created successfully!', 'success');
        setShowEventModal(false);
        fetchData();
      }
    } catch (error: any) {
      console.error('Error creating event:', error);
      showToast('Failed to create event. Please try again.', 'error');
    }
  };

  const updateEvent = async (data: any) => {
    if (!editingEvent) return;
    
    try {
      const eventData = convertToBackendEvent(data);
      const response = await EVENTS_API.UPDATE_EVENT(editingEvent.id, eventData);
      
      if (response.error) {
        showToast(response.message || 'Failed to update event', 'error');
      } else {
        showToast('Event updated successfully!', 'success');
        setEditingEvent(null);
        setShowEventModal(false);
        fetchData();
      }
    } catch (error: any) {
      console.error('Error updating event:', error);
      showToast('Failed to update event. Please try again.', 'error');
    }
  };

  const deleteEvent = async (id: number) => {
    try {
      const response = await EVENTS_API.DELETE_EVENT(id);
      
      if (response.error) {
        showToast(response.message || 'Failed to delete event', 'error');
      } else {
        showToast('Event deleted successfully!', 'success');
        fetchData();
      }
    } catch (error: any) {
      console.error('Error deleting event:', error);
      showToast('Failed to delete event. Please try again.', 'error');
    }
  };

  const toggleEventVisibility = async (id: number) => {
    try {
      const response = await EVENTS_API.TOGGLE_EVENT_VISIBILITY(id);
      
      if (response.error) {
        showToast(response.message || 'Failed to toggle visibility', 'error');
      } else {
        showToast(`Event ${response.data.isVisible ? 'shown' : 'hidden'} successfully!`, 'success');
        fetchData();
      }
    } catch (error: any) {
      console.error('Error toggling visibility:', error);
      showToast('Failed to toggle visibility. Please try again.', 'error');
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleEditEvent = (event: EventResponse) => {
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleEditEventFromList = (event: any) => {
    const eventId = typeof event.id === 'string' ? parseInt(event.id) : event.id;
    const originalEvent = events.find(e => e.id === eventId);
    if (originalEvent) {
      handleEditEvent(originalEvent);
    }
  };

  const handleDeleteEventFromList = (id: string) => {
    deleteEvent(parseInt(id));
  };

  const handleToggleEventVisibilityFromList = (id: string) => {
    toggleEventVisibility(parseInt(id));
  };

  const handleCreateTrip = () => {
    setEditingTrip(null);
    setShowTripModal(true);
  };

  const handleEditTrip = (trip: TripResponse) => {
    setEditingTrip(trip);
    setShowTripModal(true);
  };

  const handleEditTripFromList = (trip: any) => {
    const tripId = typeof trip.id === 'string' ? parseInt(trip.id) : trip.id;
    const originalTrip = trips.find(t => t.id === tripId);
    if (originalTrip) {
      handleEditTrip(originalTrip);
    }
  };

  const deleteTrip = async (id: number) => {
    try {
      const response = await EVENTS_API.DELETE_TRIP(id);
      
      if (response.error) {
        showToast(response.message || 'Failed to delete trip', 'error');
      } else {
        showToast('Trip deleted successfully!', 'success');
        fetchData();
      }
    } catch (error: any) {
      console.error('Error deleting trip:', error);
      showToast('Failed to delete trip. Please try again.', 'error');
    }
  };

  const handleDeleteTripFromList = (id: string) => {
    deleteTrip(parseInt(id));
  };

  const toggleTripVisibility = async (id: number) => {
    try {
      const response = await EVENTS_API.TOGGLE_TRIP_VISIBILITY(id);
      
      if (response.error) {
        showToast(response.message || 'Failed to toggle visibility', 'error');
      } else {
        showToast(`Trip ${response.data.isVisible ? 'shown' : 'hidden'} successfully!`, 'success');
        fetchData();
      }
    } catch (error: any) {
      console.error('Error toggling visibility:', error);
      showToast('Failed to toggle visibility. Please try again.', 'error');
    }
  };

  const handleToggleTripVisibilityFromList = (id: string) => {
    toggleTripVisibility(parseInt(id));
  };

  const handleEventSubmit = (data: any) => {
    if (editingEvent) {
      updateEvent(data);
    } else {
      createEvent(data);
    }
  };

  const handleTripSubmit = (data: any) => {
    if (editingTrip) {
      updateTrip(data);
    } else {
      createTrip(data);
    }
  };

  const createTrip = async (data: any) => {
    try {
      if (!data.title || !data.destination || !data.description) {
        showToast('Please fill in all required fields', 'warning');
        return;
      }

      if (!data.regularPrice || parseFloat(data.regularPrice) <= 0) {
        showToast('Please enter a valid regular price', 'warning');
        return;
      }

      if (!data.memberPrice || parseFloat(data.memberPrice) <= 0) {
        showToast('Please enter a valid member price', 'warning');
        return;
      }

      if (!data.availableSlots || parseInt(data.availableSlots) <= 0) {
        showToast('Please enter valid available slots', 'warning');
        return;
      }

      if (data.subscriptionTiers.length === 0) {
        showToast('Please select at least one subscription tier', 'warning');
        return;
      }

      const tripData = convertToBackendTrip(data);
      const response = await EVENTS_API.CREATE_TRIP(tripData);
      
      if (response.error) {
        showToast(response.message || 'Failed to create trip', 'error');
      } else {
        showToast('Trip created successfully!', 'success');
        setShowTripModal(false);
        fetchData();
      }
    } catch (error: any) {
      console.error('Error creating trip:', error);
      showToast('Failed to create trip. Please try again.', 'error');
    }
  };

  const updateTrip = async (data: any) => {
    if (!editingTrip) return;
    
    try {
      const tripData = convertToBackendTrip(data);
      const response = await EVENTS_API.UPDATE_TRIP(editingTrip.id, tripData);
      
      if (response.error) {
        showToast(response.message || 'Failed to update trip', 'error');
      } else {
        showToast('Trip updated successfully!', 'success');
        setEditingTrip(null);
        setShowTripModal(false);
        fetchData();
      }
    } catch (error: any) {
      console.error('Error updating trip:', error);
      showToast('Failed to update trip. Please try again.', 'error');
    }
  };

  const exportData = async () => {
    try {
      const eventsResponse = await EVENTS_API.GET_ALL_EVENTS_ADMIN();
      const tripsResponse = await EVENTS_API.GET_ALL_TRIPS_ADMIN();
      
      const data = {
        events: eventsResponse.data || [],
        trips: tripsResponse.data || [],
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admin-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Data exported successfully!', 'success');
    } catch (error) {
      showToast('Failed to export data', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <ToastContainer />

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Events and Trips</h1>
            <button
              onClick={exportData}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Export Data
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Manage events and business trips for members</p>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Dashboard
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 ${
                activeTab === 'events' 
                  ? 'text-[#9FC93B] border-b-2 border-[#9FC93B]' 
                  : 'text-gray-600'
              }`}
            >
              <Calendar size={20} />
              Events ({events.length})
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              className={`flex-1 py-4 font-medium flex items-center justify-center gap-2 ${
                activeTab === 'trips' 
                  ? 'text-[#9FC93B] border-b-2 border-[#9FC93B]' 
                  : 'text-gray-600'
              }`}
            >
              <Plane size={20} />
              Business Trips ({trips.length})
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {!loading && activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
              <button
                onClick={handleCreateEvent}
                className="flex items-center gap-2 px-4 py-2 bg-[#9FC93B] text-white rounded-lg hover:bg-[#8AB82F]"
              >
                <Plus size={20} />
                Create Event
              </button>
            </div>

            <EventList
              events={convertEventResponseArrayToFormEvents(events)}
              onEdit={handleEditEventFromList}
              onDelete={handleDeleteEventFromList}
              onToggleVisibility={handleToggleEventVisibilityFromList}
            />
          </div>
        )}

        {!loading && activeTab === 'trips' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Business Trips Management</h2>
              <button
                onClick={handleCreateTrip}
                className="flex items-center gap-2 px-4 py-2 bg-[#9FC93B] text-white rounded-lg hover:bg-[#8AB82F]"
              >
                <Plus size={20} />
                Create Trip
              </button>
            </div>

            <TripList
              trips={convertTripResponseArrayToFormTrips(trips)}
              onEdit={handleEditTripFromList}
              onDelete={handleDeleteTripFromList}
              onToggleVisibility={handleToggleTripVisibilityFromList}
            />
          </div>
        )}
      </div>

      {showEventModal && (
        <EventModal
          event={editingEvent ? convertEventResponseToFormEvent(editingEvent) : null}
          onSubmit={handleEventSubmit}
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
          }}
        />
      )}

      {showTripModal && (
        <TripModal
          trip={editingTrip ? convertTripResponseToFormTrip(editingTrip) : null}
          onSubmit={handleTripSubmit}
          onClose={() => {
            setShowTripModal(false);
            setEditingTrip(null);
          }}
        />
      )}
    </div>
  );
}
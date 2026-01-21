"use client";

import React, { useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, Plane, Users, UserCheck } from 'lucide-react';
import { Trip, subscriptionTiers } from '@/app/types/events/events.types';
import { EVENTS_API } from '@/app/api/endpoints/rest-api/events/events';
import { useToast } from '@/components/common/Toast';
import RegisteredUsersModal from './RegisteredUsersModal';

interface TripListProps {
  trips: Trip[];
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

export default function TripList({ trips, onEdit, onDelete, onToggleVisibility }: TripListProps) {
  const { showToast } = useToast();
  const [selectedTrip, setSelectedTrip] = useState<{ id: number; title: string } | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const handleViewBookings = async (tripId: number, tripTitle: string) => {
    try {
      setLoadingBookings(true);
      setSelectedTrip({ id: tripId, title: tripTitle });
      
      const response = await EVENTS_API.GET_TRIP_BOOKINGS_ADMIN(tripId);
      if (response.error) {
        showToast(response.message || 'Failed to load bookings', 'error');
      } else {
        setBookings(response.data || []);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoadingBookings(false);
    }
  };

  const closeBookingsModal = () => {
    setSelectedTrip(null);
    setBookings([]);
  };

  if (trips.length === 0) {
    return (
      <div className="col-span-full bg-white rounded-lg shadow-sm p-12 text-center">
        <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No trips created yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-32 bg-linear-to-br from-blue-400 to-blue-600 relative">
              <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                {trip.discount}% OFF
              </div>
              <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                trip.isVisible ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
              }`}>
                {trip.isVisible ? 'Visible' : 'Hidden'}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{trip.title}</h3>
              <p className="text-sm text-gray-600 mb-1">{trip.destination}</p>
              <p className="text-sm text-gray-600 mb-3">{trip.dates}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500 line-through">R{trip.regularPrice.toLocaleString()}</span>
                <span className="text-xl font-bold text-[#9FC93B]">R{trip.memberPrice.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
                <Users className="w-4 h-4" />
                {trip.bookedSlots} / {trip.availableSlots} slots booked
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {trip.subscriptionTiers.map((tier) => (
                  <span key={tier} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {subscriptionTiers.find(t => t.value === tier)?.label}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleViewBookings(parseInt(trip.id), trip.title)}
                  disabled={loadingBookings}
                  className="flex-1 p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  {loadingBookings ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mx-auto"></div>
                  ) : (
                    <UserCheck className="w-5 h-5 mx-auto" />
                  )}
                </button>
                <button
                  onClick={() => onToggleVisibility(trip.id)}
                  className="flex-1 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {trip.isVisible ? <Eye className="w-5 h-5 mx-auto" /> : <EyeOff className="w-5 h-5 mx-auto" />}
                </button>
                <button
                  onClick={() => onEdit(trip)}
                  className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5 mx-auto" />
                </button>
                <button
                  onClick={() => onDelete(trip.id)}
                  className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTrip && (
        <RegisteredUsersModal
          type="trip"
          itemId={selectedTrip.id}
          itemTitle={selectedTrip.title}
          bookings={bookings}
          onClose={closeBookingsModal}
        />
      )}
    </>
  );
}
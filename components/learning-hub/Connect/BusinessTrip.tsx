"use client";

import React, { useEffect, useState } from 'react';
import { EVENTS_API, TripResponse } from '@/app/api/endpoints/rest-api/events/events';
import { useToast } from '@/components/common/Toast';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Clock, Users, AlertCircle, Eye, ChevronRight } from 'lucide-react';
import TripModal from './TripModal';

export function BusinessTrips() {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<number | null>(null);
  const [showRegistrationAlert, setShowRegistrationAlert] = useState(false);
  
  const [selectedTrip, setSelectedTrip] = useState<TripResponse | null>(null);
  const [showTripModal, setShowTripModal] = useState(false);
  const [userBookings, setUserBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchTrips();
    fetchUserBookings();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await EVENTS_API.GET_USER_TRIPS();
      
      if (response.error) {
        if (response.status === 401) {
          showToast('Please login to view trips', 'error');
          router.push('/auth/login');
        } else {
          showToast(response.message || 'Failed to load trips', 'error');
        }
      } else {
        const visibleTrips = (response.data || []).filter(trip => trip.isVisible);
        setTrips(visibleTrips);
      }
    } catch (err: any) {
      console.error('Error fetching trips:', err);
      showToast('Failed to load trips. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const response = await EVENTS_API.GET_USER_TRIPS();
      if (!response.error && response.data) {
        setUserBookings(response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const isUserBooked = (tripId: number): boolean => {
    return userBookings.some(booking => 
      booking.tripId === tripId && booking.status === 'confirmed'
    );
  };

  const handleBookTrip = async (tripId: number, numberOfSlots: number = 1) => {
    try {
      setBooking(tripId);
      const response = await EVENTS_API.BOOK_TRIP(tripId, numberOfSlots);
      
      if (response.error) {
        if (response.status === 400 && response.message?.includes("complete your profile")) {
          showToast("Please complete your profile registration first", 'warning');
          setShowRegistrationAlert(true);
          setTimeout(() => {
            router.push('/profile/registration');
          }, 2000);
          return;
        }
        
        if (response.status === 401) {
          showToast('Please login to book trips', 'error');
          router.push('/auth/login');
        } else if (response.status === 400) {
          showToast(response.message || 'Trip is not available', 'warning');
        } else if (response.status === 403) {
          showToast("Your subscription tier doesn't have access to this trip", 'error');
        } else {
          showToast(response.message || 'Failed to book trip', 'error');
        }
      } else {
        showToast('Trip booking created! Complete payment to confirm.', 'success');
        await fetchUserBookings();
        setShowTripModal(false);
        
        if (response.data?.id) {
          router.push(`/payment/trip/${response.data.id}`);
        }
      }
    } catch (err: any) {
      console.error('Error booking trip:', err);
      
      if (err.status === 400) {
        showToast("Please complete your profile registration first", 'warning');
        setShowRegistrationAlert(true);
        setTimeout(() => {
          router.push('/profile/registration');
        }, 2000);
      } else {
        showToast('Failed to book trip. Please try again.', 'error');
      }
    } finally {
      setBooking(null);
    }
  };

  const handleViewDetails = (trip: TripResponse) => {
    setSelectedTrip(trip);
    setShowTripModal(true);
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="py-12">
        <ToastContainer />
        <div className="flex justify-center items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="py-12">
        <ToastContainer />
        <div className="text-center bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Trips Available</h3>
          <p className="text-gray-600 mb-6">
            Check back soon for exciting business trips and networking opportunities.
          </p>
          <button
            onClick={() => router.push('/membership')}
            className="px-6 py-3 bg-[#9FC93B] text-white rounded-lg hover:bg-[#8AB82F] font-medium transition-colors"
          >
            Upgrade Membership
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      
      <TripModal
        trip={selectedTrip}
        isOpen={showTripModal}
        onClose={() => setShowTripModal(false)}
        isUserBooked={selectedTrip ? isUserBooked(selectedTrip.id) : false}
        onBook={(slots) => selectedTrip && handleBookTrip(selectedTrip.id, slots)}
        isBooking={selectedTrip?.id === booking}
      />
      
      {showRegistrationAlert && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please complete your profile registration to book trips.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => {
          const isFull = trip.bookedSlots >= trip.availableSlots;
          const booked = isUserBooked(trip.id);
          
          return (
            <div 
              key={trip.id} 
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              <div 
                className="relative h-48 bg-linear-to-br from-blue-100 to-green-100 cursor-pointer"
                onClick={() => handleViewDetails(trip)}
              >
                {trip.imageUrl ? (
                  <img 
                    src={trip.imageUrl} 
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                {trip.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {trip.discount}% OFF
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View Details</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-[#9FC93B] bg-green-100 rounded-full">
                    {trip.category}
                  </span>
                </div>

                <h3 
                  className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-[#9FC93B] transition-colors"
                  onClick={() => handleViewDetails(trip)}
                >
                  {trip.title}
                </h3>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-2 shrink-0" />
                  <span className="text-sm">{trip.destination}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 shrink-0" />
                    <span className="text-sm">{trip.dates}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 shrink-0" />
                    <span className="text-sm">{trip.time}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {truncateText(trip.description, 100)}
                  {trip.description && trip.description.length > 100 && (
                    <button 
                      onClick={() => handleViewDetails(trip)}
                      className="text-[#9FC93B] hover:text-[#8AB82F] ml-1 font-medium inline-flex items-center"
                    >
                      Read more <ChevronRight className="w-3 h-3 ml-0.5" />
                    </button>
                  )}
                </p>

                <div className="flex items-center text-gray-700 mb-4 pb-4 border-b border-gray-200">
                  <Users className="w-4 h-4 mr-2 shrink-0" />
                  <span className="text-sm font-medium">
                    {trip.bookedSlots} / {trip.availableSlots} slots booked
                  </span>
                  {isFull && (
                    <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                      Sold Out
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-sm text-gray-500 line-through">
                        {formatCurrency(trip.regularPrice)}
                      </p>
                      <p className="text-2xl font-bold text-[#9FC93B]">
                        {formatCurrency(trip.memberPrice)}
                      </p>
                      <p className="text-xs text-gray-500">Member Price</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        Save {formatCurrency(trip.regularPrice - trip.memberPrice)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(trip)}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  
                  {!isFull && (
                    <button
                      onClick={() => handleBookTrip(trip.id, 1)}
                      disabled={booking === trip.id || booked}
                      className={`flex-1 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                        booked
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-[#9FC93B] text-white hover:bg-[#8AB82F]'
                      }`}
                    >
                      {booking === trip.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : booked ? (
                        'Booked'
                      ) : (
                        'Book Now'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
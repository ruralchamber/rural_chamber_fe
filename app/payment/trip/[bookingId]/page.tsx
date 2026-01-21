"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CreditCard, Lock, MapPin, Calendar, Users, Loader2, Plane, Home, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { TRIP_PAYMENT_API } from '@/app/api/endpoints/rest-api/trips/trips';
import { EVENTS_API } from '@/app/api/endpoints/rest-api/events/events';

export default function TripPaymentPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId as string;
  
  const [booking, setBooking] = useState<any>(null);
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    if (bookingId) {
      loadBookingDetails();
    }
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await TRIP_PAYMENT_API.GET_BOOKING_BY_ID(parseInt(bookingId));
      
      if (response.error) {
        toast.error(response.message || 'Failed to load booking details');
        router.push('/connect-hub');
        return;
      }

      const bookingData = response.data;
      setBooking(bookingData);

      if (bookingData.status === 'confirmed') {
        toast.success('This booking has already been paid');
        router.push(`/payment/trip/success?reference=${bookingData.paymentReference}`);
        return;
      }

      const tripResponse = await EVENTS_API.GET_TRIP_BY_ID(bookingData.tripId);
      if (!tripResponse.error) {
        setTrip(tripResponse.data);
      }
    } catch (error) {
      console.error('Error loading booking:', error);
      toast.error('Failed to load booking details');
      router.push('/connect-hub');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handlePayNow = async () => {
    try {
      setProcessing(true);
      
      console.log('📝 Initializing payment for booking:', bookingId);
      
      const response = await TRIP_PAYMENT_API.INITIALIZE_PAYMENT(parseInt(bookingId));
      
      console.log('🔍 API Response:', response);
      
      if (response.error) {
        throw new Error(response.message || 'Failed to initialize payment');
      }

      if (response.data?.authorization_url) {
        const authUrl = response.data.authorization_url;
        console.log('✅ Redirecting to Paystack:', authUrl);
        toast.success('Redirecting to payment gateway...');
        
        window.location.replace(authUrl);
      } else {
        console.error('❌ No authorization_url found:', response);
        throw new Error('Payment initialization failed - no redirect URL received');
      }
      
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to initialize payment. Please try again.');
      setProcessing(false);
    }
  };

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelDialog(false);
    router.push('/connect-hub');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Booking not found</p>
          <button
            onClick={() => router.push('/connect-hub/trips')}
            className="mt-4 px-6 py-2 bg-[#9FC93B] text-white rounded-lg hover:bg-[#8AB82F]"
          >
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-linear-to-r from-[#01311B] to-[#024d2f] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Plane className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Complete Your Trip Booking
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              You're one step away from confirming your trip to {trip.destination}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Details</h2>
              
              {trip.imageUrl && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img
                    src={trip.imageUrl}
                    alt={trip.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{trip.title}</h3>
                  <p className="text-gray-600 mt-2">{trip.description}</p>
                </div>

                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-2 text-[#9FC93B]" />
                  <span>{trip.destination}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 mr-2 text-[#9FC93B]" />
                  <span>{trip.dates}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <Users className="w-5 h-5 mr-2 text-[#9FC93B]" />
                  <span>{booking.numberOfSlots} {booking.numberOfSlots === 1 ? 'slot' : 'slots'}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price per slot</span>
                  <span className="font-semibold">{formatCurrency(booking.totalAmount / booking.numberOfSlots)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Number of slots</span>
                  <span className="font-semibold">{booking.numberOfSlots}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-[#9FC93B]">{formatCurrency(booking.totalAmount)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Summary</h2>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700 font-medium">Amount to Pay</span>
                  <span className="text-3xl font-bold text-gray-900">
                    {formatCurrency(booking.totalAmount)}
                  </span>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                  <Lock className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">100% Secure Payment</span> via Paystack. Your payment information is encrypted and never stored on our servers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={handlePayNow}
                  disabled={processing}
                  className="w-full bg-[#9FC93B] hover:bg-[#8AB82F] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  {processing ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Pay Now
                    </>
                  )}
                </button>

                <button
                  onClick={handleCancelClick}
                  disabled={processing}
                  className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Cancel & Go Back
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Instant booking confirmation</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Email confirmation & receipt</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>24/7 customer support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {showCancelDialog && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <X className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Cancel Payment?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this payment? Your booking will remain pending until payment is completed.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                  disabled={processing}
                >
                  Continue Payment
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="px-8 py-3 bg-[#9FC93B] hover:bg-[#8AB82F] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Yes, Go Back
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
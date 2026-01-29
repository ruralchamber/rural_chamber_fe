"use client";

import React, { useEffect, useState } from 'react';
import { X, MapPin, Calendar, Clock, Users, Tag, Image as ImageIcon, DollarSign, ArrowRight, AlertCircle, CheckCircle, Building2 } from 'lucide-react';
import { TripResponse } from "@/app/api/endpoints/rest-api/events/events";

interface TripModalProps {
  trip: TripResponse | null;
  isOpen: boolean;
  onClose: () => void;
  isUserBooked?: boolean;
  onBook?: (numberOfSlots: number) => void;
  isBooking?: boolean;
}

export default function TripModal({
  trip,
  isOpen,
  onClose,
  isUserBooked = false,
  onBook,
  isBooking = false
}: TripModalProps) {
  const [numberOfSlots, setNumberOfSlots] = useState(1);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setNumberOfSlots(1);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !trip) return null;

  const isTripFull = trip.bookedSlots >= trip.availableSlots;
  const availableSlots = Math.max(0, trip.availableSlots - trip.bookedSlots);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const calculateSavings = () => {
    return trip.regularPrice - trip.memberPrice;
  };

  const calculateTotal = () => {
    return numberOfSlots * trip.memberPrice;
  };

  const handleBook = () => {
    if (onBook && numberOfSlots > 0 && numberOfSlots <= availableSlots) {
      onBook(numberOfSlots);
    }
  };

  const incrementSlots = () => {
    if (numberOfSlots < availableSlots) {
      setNumberOfSlots(prev => prev + 1);
    }
  };

  const decrementSlots = () => {
    if (numberOfSlots > 1) {
      setNumberOfSlots(prev => prev - 1);
    }
  };

  const isValidImage = trip.imageUrl && (
    trip.imageUrl.startsWith('http') || 
    trip.imageUrl.startsWith('https') || 
    trip.imageUrl.startsWith('data:image') ||
    trip.imageUrl.startsWith('/')
  );

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-100 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="trip-modal-title"
      >
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 
                  id="trip-modal-title"
                  className="text-2xl font-bold text-gray-900 line-clamp-2"
                >
                  {trip.title}
                </h3>
                {trip.discount > 0 && (
                  <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold whitespace-nowrap shrink-0">
                    {trip.discount}% OFF
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {trip.category || 'Business Trip'}
                </span>
                {!trip.isVisible && (
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                    Hidden
                  </span>
                )}
                {isTripFull && (
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                    Sold Out
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

        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            <div>
              <div className="h-64 rounded-lg overflow-hidden mb-6 bg-linear-to-br from-blue-50 to-green-50">
                {isValidImage ? (
                  <img 
                    src={trip.imageUrl} 
                    alt={trip.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.className = "w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <MapPin className="w-16 h-16 text-blue-300 mb-4" />
                    <p className="text-gray-400">No image available</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Trip Description</h4>
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {trip.description || 'No description available.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Trip Details</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#9FC93B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Destination</p>
                      <p className="font-medium text-gray-900">{trip.destination}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#9FC93B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Dates</p>
                      <p className="font-medium text-gray-900">{trip.dates}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#9FC93B] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium text-gray-900">{trip.time || 'All Day'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-[#9FC93B] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Available Slots</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium text-gray-900">
                              {trip.bookedSlots} / {trip.availableSlots} booked
                            </p>
                            {isTripFull ? (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                Sold Out
                              </span>
                            ) : (
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                                {availableSlots} spots left
                              </span>
                            )}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#9FC93B] h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${Math.min(100, (trip.bookedSlots / trip.availableSlots) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Pricing</h4>
                
                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Regular Price:</span>
                    <span className="text-lg font-semibold line-through text-gray-500">
                      {formatCurrency(trip.regularPrice)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#9FC93B]" />
                      <span className="text-gray-600">Member Price:</span>
                    </div>
                    <span className="text-2xl font-bold text-[#9FC93B]">
                      {formatCurrency(trip.memberPrice)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-gray-600">You Save:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(calculateSavings())}
                    </span>
                  </div>
                </div>
              </div>

              {trip.subscriptionTiers && trip.subscriptionTiers.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Available For</p>
                  <div className="flex flex-wrap gap-2">
                    {trip.subscriptionTiers.map((tier) => (
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
                        {tier.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')} Members
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!isTripFull && !isUserBooked && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">Select Number of Slots</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{availableSlots} available</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={decrementSlots}
                      disabled={numberOfSlots <= 1}
                      className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      -
                    </button>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{numberOfSlots}</div>
                      <div className="text-sm text-gray-500">slot{numberOfSlots !== 1 ? 's' : ''}</div>
                    </div>
                    
                    <button
                      onClick={incrementSlots}
                      disabled={numberOfSlots >= availableSlots}
                      className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-center text-sm text-gray-600">
                    {numberOfSlots} slot{numberOfSlots !== 1 ? 's' : ''} × {formatCurrency(trip.memberPrice)} each
                  </div>
                </div>
              )}

              {isUserBooked && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center text-green-700">
                    <CheckCircle className="w-5 h-5 mr-2 shrink-0" />
                    <span className="font-medium">You have booked this trip</span>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">
                      Need help or have questions? Contact our trips team at trips@ruralchamber.co.za
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Close Details
            </button>
            
            {!isTripFull && !isUserBooked && (
              <button
                onClick={handleBook}
                disabled={isBooking || numberOfSlots > availableSlots}
                className="flex-1 px-6 py-3 bg-linear-to-r from-[#9FC93B] to-[#8AB82F] text-white rounded-lg hover:opacity-90 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isBooking ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-5 h-5" />
                    Book Now - {formatCurrency(calculateTotal())}
                  </>
                )}
              </button>
            )}
            
            {isTripFull && (
              <div className="flex-1 px-6 py-3 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                This trip is sold out
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
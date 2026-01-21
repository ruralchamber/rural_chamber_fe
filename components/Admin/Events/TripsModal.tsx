"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Save, Upload, Image as ImageIcon, DollarSign, Users, MapPin, Calendar, Clock, Loader2 } from 'lucide-react';
import { SubscriptionTier, subscriptionTiers } from '@/app/types/events/events.types';

interface TripModalProps {
  trip: {
    id?: string;
    title: string;
    destination: string;
    dates: string;
    regularPrice: number;
    memberPrice: number;
    discount: number;
    imageUrl: string;
    availableSlots: number;
    category: string;
    description: string;
    subscriptionTiers: SubscriptionTier[];
    isVisible: boolean;
    time: string;
  } | null;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export default function TripModal({ trip, onSubmit, onClose }: TripModalProps) {
  const [formData, setFormData] = useState({
    title: trip?.title || '',
    destination: trip?.destination || '',
    dates: trip?.dates || '',
    regularPrice: trip?.regularPrice?.toString() || '',
    memberPrice: trip?.memberPrice?.toString() || '',
    discount: trip?.discount?.toString() || '0',
    imageUrl: trip?.imageUrl || '',
    availableSlots: trip?.availableSlots?.toString() || '',
    subscriptionTiers: trip?.subscriptionTiers || [],
    isVisible: trip?.isVisible !== false,
    category: trip?.category || 'Business',
    description: trip?.description || '',
    time: trip?.time || 'All Day'
  });

  const [imagePreview, setImagePreview] = useState(trip?.imageUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on escape key and outside click
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, isSubmitting]);

  // Reset form when trip changes
  useEffect(() => {
    if (trip) {
      setFormData({
        title: trip.title,
        destination: trip.destination,
        dates: trip.dates,
        regularPrice: trip.regularPrice.toString(),
        memberPrice: trip.memberPrice.toString(),
        discount: trip.discount.toString(),
        imageUrl: trip.imageUrl,
        availableSlots: trip.availableSlots.toString(),
        subscriptionTiers: trip.subscriptionTiers,
        isVisible: trip.isVisible,
        category: trip.category || 'Business',
        description: trip.description,
        time: trip.time || 'All Day'
      });
      setImagePreview(trip.imageUrl || '');
    }
    setIsSubmitting(false);
  }, [trip]);

  const handleFormChange = (field: string, value: any) => {
    if (isSubmitting) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (tier: SubscriptionTier, checked: boolean) => {
    if (isSubmitting) return;
    
    if (checked) {
      handleFormChange('subscriptionTiers', [...formData.subscriptionTiers, tier]);
    } else {
      handleFormChange('subscriptionTiers', formData.subscriptionTiers.filter(t => t !== tier));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmitting) return;
    
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        handleFormChange('imageUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const tripCategories = ['International', 'Domestic', 'Networking', 'Business', 'Educational'];

  const subscriptionTierValues = subscriptionTiers.map(tier => tier.value) as SubscriptionTier[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-gray-900">
                {trip ? 'Edit Trip' : 'Create New Trip'}
              </h3>
              {isSubmitting && (
                <Loader2 className="w-5 h-5 text-[#9FC93B] animate-spin" />
              )}
            </div>
            <button 
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
           
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trip Image</label>
              <div className="flex items-center gap-4">
                <div
                  onClick={() => !isSubmitting && fileInputRef.current?.click()}
                  className={`w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center ${
                    isSubmitting 
                      ? 'border-gray-200 cursor-not-allowed' 
                      : 'border-gray-300 hover:border-[#9FC93B] cursor-pointer'
                  }`}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className={`w-8 h-8 mx-auto mb-2 ${isSubmitting ? 'text-gray-300' : 'text-gray-400'}`} />
                      <p className={`text-xs ${isSubmitting ? 'text-gray-400' : 'text-gray-500'}`}>
                        {isSubmitting ? 'Processing...' : 'Click to upload'}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => {
                        if (!isSubmitting) {
                          handleFormChange('imageUrl', e.target.value);
                          setImagePreview(e.target.value);
                        }
                      }}
                      placeholder="Or paste image URL"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trip Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="Business Summit 2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => handleFormChange('destination', e.target.value)}
                    placeholder="e.g., Nairobi, Kenya"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dates *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.dates}
                    onChange={(e) => handleFormChange('dates', e.target.value)}
                    placeholder="e.g., Jan 15-20, 2026"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {tripCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Regular Price (R) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.regularPrice}
                    onChange={(e) => handleFormChange('regularPrice', e.target.value)}
                    placeholder="45000"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                    required
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Price (R) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.memberPrice}
                    onChange={(e) => handleFormChange('memberPrice', e.target.value)}
                    placeholder="36000"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                    required
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%) *</label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => handleFormChange('discount', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                  required
                  min="0"
                  max="100"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Slots *</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.availableSlots}
                    onChange={(e) => handleFormChange('availableSlots', e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                    required
                    min="1"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => handleFormChange('time', e.target.value)}
                    placeholder="All Day"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Describe the trip details..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visible to Subscription Tiers
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {subscriptionTiers.map((tier) => (
                  <label 
                    key={tier.value} 
                    className={`flex items-center gap-2 p-2 rounded ${
                      isSubmitting 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.subscriptionTiers.includes(tier.value as SubscriptionTier)}
                      onChange={(e) => handleCheckboxChange(tier.value as SubscriptionTier, e.target.checked)}
                      className="w-4 h-4 text-[#9FC93B] rounded disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    />
                    <span className={`text-sm ${isSubmitting ? 'text-gray-400' : 'text-gray-700'}`}>
                      {tier.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Visibility</p>
                <p className="text-sm text-gray-600">Show/hide from members</p>
              </div>
              <label className={`flex items-center ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <div className="relative">
                  <div className={`w-12 h-6 rounded-full ${formData.isVisible ? 'bg-[#9FC93B]' : 'bg-gray-300'} ${isSubmitting ? 'opacity-50' : ''}`}></div>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isVisible ? 'transform translate-x-7' : 'transform translate-x-1'}`}></div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) => handleFormChange('isVisible', e.target.checked)}
                  className="hidden"
                  disabled={isSubmitting}
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-[#9FC93B] text-white rounded-lg hover:bg-[#8AB82F] disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {trip ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {trip ? 'Update Trip' : 'Create Trip'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
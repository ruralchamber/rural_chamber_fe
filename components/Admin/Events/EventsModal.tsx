"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Calendar, Clock, MapPin, Users, Tag, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Event, subscriptionTiers, eventCategories } from '@/app/types/events/events.types';

interface EventModalProps {
  event: Event | null;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export default function EventModal({ event, onSubmit, onClose }: EventModalProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
    defaultValues: event ? {
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      time: event.time,
      location: event.location,
      attendees: event.attendees.toString(),
      status: event.status,
      subscriptionTiers: event.subscriptionTiers,
      isVisible: event.isVisible,
      image: event.image,
      month: event.month,
      day: event.day.toString(),
    } : {
      title: '',
      description: '',
      category: '',
      date: '',
      time: '',
      location: '',
      attendees: '',
      status: 'Upcoming',
      subscriptionTiers: ['free'],
      isVisible: true,
      image: '',
      month: '',
      day: '',
    }
  });

  const [imagePreview, setImagePreview] = useState(event?.image || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedTiers = watch('subscriptionTiers');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isSubmitting) {
          onClose();
        }
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

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        category: event.category,
        date: event.date,
        time: event.time,
        location: event.location,
        attendees: event.attendees.toString(),
        status: event.status,
        subscriptionTiers: event.subscriptionTiers,
        isVisible: event.isVisible,
        image: event.image,
        month: event.month,
        day: event.day.toString(),
      });
      setImagePreview(event.image || '');
    } else {
      reset({
        title: '',
        description: '',
        category: '',
        date: '',
        time: '',
        location: '',
        attendees: '',
        status: 'Upcoming',
        subscriptionTiers: ['free'],
        isVisible: true,
        image: '',
        month: '',
        day: '',
      });
      setImagePreview('');
    }
    setIsSubmitting(false);
  }, [event, reset]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmitting) return;
    
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setValue('image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTierToggle = (tier: string) => {
    if (isSubmitting) return;
    
    const current = selectedTiers || [];
    const newTiers = current.includes(tier)
      ? current.filter(t => t !== tier)
      : [...current, tier];
    setValue('subscriptionTiers', newTiers);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmitting) return;
    
    if (e.target.value) {
      const date = new Date(e.target.value);
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
      const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const day = date.getDate();
      
      setValue('date', formattedDate);
      setValue('month', month);
      setValue('day', day.toString());
    }
  };

  const submitHandler = async (data: any) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(data);
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
                {event ? 'Edit Event' : 'Create New Event'}
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
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
           
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
              <div className="flex items-center gap-4">
                <div
                  onClick={() => !isSubmitting && fileInputRef.current?.click()}
                  className={`w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer ${
                    isSubmitting 
                      ? 'border-gray-200 cursor-not-allowed' 
                      : 'border-gray-300 hover:border-[#9FC93B]'
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
                      {...register('image')}
                      placeholder="Or paste image URL"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Upload an image or paste a URL. Recommended: 800x450px
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Annual Conference 2025"
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  <option value="">Select category</option>
                  {eventCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    onChange={handleDateChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    {...register('time', { required: 'Time is required' })}
                    placeholder="09:00 AM - 05:00 PM"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Past">Past</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    {...register('location', { required: 'Location is required' })}
                    placeholder="Venue name"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attendees *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    {...register('attendees')}
                    placeholder="100"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.attendees && (
                  <p className="text-red-500 text-sm mt-1">{errors.attendees.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Describe your event..."
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visible to Subscription Tiers
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
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
                      checked={selectedTiers?.includes(tier.value)}
                      onChange={() => handleTierToggle(tier.value)}
                      disabled={isSubmitting}
                      className="w-4 h-4 text-[#9FC93B] rounded disabled:cursor-not-allowed"
                    />
                    <span className={`text-sm ${isSubmitting ? 'text-gray-400' : ''}`}>
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
                <input
                  type="checkbox"
                  {...register('isVisible')}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <div className="relative">
                  <div className={`w-12 h-6 rounded-full ${watch('isVisible') ? 'bg-[#9FC93B]' : 'bg-gray-300'} ${isSubmitting ? 'opacity-50' : ''}`}></div>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${watch('isVisible') ? 'transform translate-x-7' : 'transform translate-x-1'}`}></div>
                </div>
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
                    {event ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    {event ? 'Update Event' : 'Create Event'}
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
// types/events/events.types.ts
export type SubscriptionTier = 'free' | 'individual_silver' | 'individual_gold' | 'individual_platinum' | 
  'organizational_silver' | 'organizational_gold' | 'organizational_platinum';

export interface Event {
  registeredAttendees: number;
  capacity: any;
  id: string;
  month: string;
  day: string | number;
  image: string;
  title: string;
  description: string;
  date: string;
  time: string;
  maxAttendees?: number; 
  location: string;
  attendees: number;
  category: string;
  status: 'Upcoming' | 'Past';
  subscriptionTiers: SubscriptionTier[];
  isVisible: boolean;
  createdAt: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  dates: string;
  time: string;
  bookedSlots: number; 
  regularPrice: number;
  memberPrice: number;
  discount: number;
  imageUrl: string;
  availableSlots: number;
  category: string;
  description: string;
  subscriptionTiers: SubscriptionTier[];
  isVisible: boolean;
  createdAt: string;
}

export const subscriptionTiers = [
  { value: 'free', label: 'Free' },
  { value: 'individual_silver', label: 'Individual Silver' },
  { value: 'individual_gold', label: 'Individual Gold' },
  { value: 'individual_platinum', label: 'Individual Platinum' },
  { value: 'organizational_silver', label: 'Organizational Silver' },
  { value: 'organizational_gold', label: 'Organizational Gold' },
  { value: 'organizational_platinum', label: 'Organizational Platinum' },
];

export const eventCategories = ['Conference', 'Workshop', 'Seminar', 'Expo', 'Networking', 'Training'];
export const tripCategories = ['International', 'Domestic', 'Networking', 'Business', 'Educational'];
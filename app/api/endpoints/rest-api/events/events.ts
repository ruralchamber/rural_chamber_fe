// src/app/api/endpoints/rest-api/events/events.ts
import { POST, GET, PUT, DELETE, PATCH } from "@/app/api/lib/client";
import { CustomResponse } from "@/interfaces/response";
import { baseUrl } from "../../url";

const EventsBaseURL = `${baseUrl}/events`;

export interface EventResponse {
  registeredAttendees: number;
  capacity: number | undefined;
  id: number;
  userId: number;
  month: string;
  day: number;
  image: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees?: number;
  category: string;
  status: "upcoming" | "past" | "cancelled";
  description: string;
  subscriptionTiers: string[];
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TripResponse {
  id: number;
  userId: number;
  title: string;
  destination: string;
  dates: string;
  time: string;
  regularPrice: number;
  memberPrice: number;
  discount: number;
  imageUrl: string;
  availableSlots: number;
  bookedSlots: number;
  category: string;
  description: string;
  subscriptionTiers: string[];
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistrationResponse {
  id: number;
  eventId: number;
  userId: number;
  registrationId: number;
  status: string;
  registrationDate: string;
  user?: {
    id: number;
    email: string;
    fullName: string;
    cellphone: string;
  };
  registration?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    cellphone: string;
    membershipType: string;
  };
}

export interface TripBookingResponse {
  id: number;
  tripId: number;
  userId: number;
  registrationId: number;
  numberOfSlots: number;
  totalAmount: number;
  status: string;
  bookingDate: string;
  paymentReference?: string;
  user?: {
    id: number;
    email: string;
    fullName: string;
    cellphone: string;
    companyName?: string;
    membershipType?: string;
  };
  registration?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    cellphone: string;
    membershipType: string;
  };
  trip?: {
    id: number;
    title: string;
    destination: string;
    dates: string;
  };
}

export interface CreateEventData {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees?: number;
  status: "upcoming" | "past";
  subscriptionTiers: string[];
  isVisible: boolean;
  image: string;
  month: string;
  day: number;
}

export interface CreateTripData {
  title: string;
  destination: string;
  dates: string;
  time: string;
  regularPrice: number;
  memberPrice: number;
  discount: number;
  imageUrl: string;
  availableSlots: number;
  category: string;
  description: string;
  subscriptionTiers: string[];
  isVisible: boolean;
}

export const EVENTS_API = {
  CREATE_EVENT: async (
    data: CreateEventData
  ): Promise<CustomResponse<EventResponse>> => {
    try {
      const response = await POST(`${EventsBaseURL}/admin/events`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  UPDATE_EVENT: async (
    eventId: number,
    data: Partial<CreateEventData>
  ): Promise<CustomResponse<EventResponse>> => {
    try {
      const response = await PUT(`${EventsBaseURL}/admin/events/${eventId}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  DELETE_EVENT: async (eventId: number): Promise<CustomResponse<null>> => {
    try {
      const response = await DELETE(`${EventsBaseURL}/admin/events/${eventId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  TOGGLE_EVENT_VISIBILITY: async (
    eventId: number
  ): Promise<CustomResponse<EventResponse>> => {
    try {
      const response = await PATCH(`${EventsBaseURL}/admin/events/${eventId}/visibility`);
      return response;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        console.error('Network error when toggling visibility:', error);
        return {
          success: false,
          error: true,
          message: 'Network error. Please check your connection and CORS settings.',
          data: null
        } as any;
      }
      throw error;
    }
  },

  GET_ALL_EVENTS_ADMIN: async (): Promise<CustomResponse<EventResponse[]>> => {
    try {
      const response = await GET(`${EventsBaseURL}/admin/events`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_EVENT_REGISTRATIONS_ADMIN: async (
    eventId: number
  ): Promise<CustomResponse<EventRegistrationResponse[]>> => {
    try {
      const response = await GET(`${EventsBaseURL}/admin/events/${eventId}/registrations`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  CREATE_TRIP: async (
    data: CreateTripData
  ): Promise<CustomResponse<TripResponse>> => {
    try {
      const response = await POST(`${EventsBaseURL}/admin/trips`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  UPDATE_TRIP: async (
    tripId: number,
    data: Partial<CreateTripData>
  ): Promise<CustomResponse<TripResponse>> => {
    try {
      const response = await PUT(`${EventsBaseURL}/admin/trips/${tripId}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  DELETE_TRIP: async (tripId: number): Promise<CustomResponse<null>> => {
    try {
      const response = await DELETE(`${EventsBaseURL}/admin/trips/${tripId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  TOGGLE_TRIP_VISIBILITY: async (
    tripId: number
  ): Promise<CustomResponse<TripResponse>> => {
    try {
      const response = await PATCH(`${EventsBaseURL}/admin/trips/${tripId}/visibility`);
      return response;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        console.error('Network error when toggling visibility:', error);
        return {
          success: false,
          error: true,
          message: 'Network error. Please check your connection and CORS settings.',
          data: null
        } as any;
      }
      throw error;
    }
  },

  GET_ALL_TRIPS_ADMIN: async (): Promise<CustomResponse<TripResponse[]>> => {
    try {
      const response = await GET(`${EventsBaseURL}/admin/trips`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_TRIP_BOOKINGS_ADMIN: async (
    tripId: number
  ): Promise<CustomResponse<TripBookingResponse[]>> => {
    try {
      const response = await GET(`${EventsBaseURL}/admin/trips/${tripId}/bookings`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_PUBLIC_EVENTS: async (): Promise<CustomResponse<EventResponse[]>> => {
    try {
      const response = await GET(`${EventsBaseURL}/public/events`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_EVENT_BY_ID: async (
    eventId: number
  ): Promise<CustomResponse<EventResponse>> => {
    try {
      const response = await GET(`${EventsBaseURL}/public/events/${eventId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_USER_EVENTS: async (): Promise<CustomResponse<EventResponse[]>> => {
    try {
      const response = await GET(`${EventsBaseURL}/my-events`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  REGISTER_FOR_EVENT: async (
    eventId: number
  ): Promise<CustomResponse<EventRegistrationResponse>> => {
    try {
      const response = await POST(`${EventsBaseURL}/register/${eventId}`, {});
      
      if (response.error) {
        if (response.message?.includes("Registration not found") || 
            response.message?.includes("complete your profile")) {
          return {
            success: false,
            error: true,
            message: "Please complete your profile registration before registering for events.",
            data: null,
            status: 400
          } as any;
        }
        if (response.message?.includes("already registered")) {
          return {
            success: false,
            error: true,
            message: "You are already registered for this event.",
            data: null,
            status: 409
          } as any;
        }
        if (response.message?.includes("fully booked")) {
          return {
            success: false,
            error: true,
            message: "This event is fully booked.",
            data: null,
            status: 400
          } as any;
        }
      }
      
      return response;
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error.response?.status === 400) {
        return {
          success: false,
          error: true,
          message: "Please complete your profile registration first.",
          data: null,
          status: 400
        } as any;
      }
      
      return {
        success: false,
        error: true,
        message: error.message || "Failed to register for event. Please try again.",
        data: null,
        status: error.response?.status || 500
      } as any;
    }
  },

  CANCEL_EVENT_REGISTRATION: async (
    registrationId: number
  ): Promise<CustomResponse<null>> => {
    try {
      const response = await DELETE(`${EventsBaseURL}/registrations/${registrationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_USER_REGISTRATIONS: async (): Promise<CustomResponse<EventRegistrationResponse[]>> => {
    try {
      const response = await GET(`${EventsBaseURL}/my-registrations`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_USER_TRIPS: async (): Promise<CustomResponse<TripResponse[]>> => {
    try {
      const response = await GET(`${EventsBaseURL}/my-trips`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_TRIP_BY_ID: async (tripId: number): Promise<CustomResponse<TripResponse>> => {
    try {
      const response = await GET(`${EventsBaseURL}/trips/${tripId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  BOOK_TRIP: async (
    tripId: number,
    numberOfSlots: number = 1
  ): Promise<CustomResponse<TripBookingResponse>> => {
    try {
      const response = await POST(`${EventsBaseURL}/trips/${tripId}/book`, {
        numberOfSlots,
      });
      
      if (response.error) {
        if (response.message?.includes("Registration not found") || 
            response.message?.includes("complete your profile")) {
          return {
            success: false,
            error: true,
            message: "Please complete your profile registration before booking trips.",
            data: null,
            status: 400
          } as any;
        }
        if (response.message?.includes("Only")) {
          return {
            success: false,
            error: true,
            message: response.message,
            data: null,
            status: 400
          } as any;
        }
      }
      
      return response;
    } catch (error: any) {
      console.error("Booking error:", error);
      
      if (error.response?.status === 400) {
        return {
          success: false,
          error: true,
          message: "Please complete your profile registration first.",
          data: null,
          status: 400
        } as any;
      }
      
      return {
        success: false,
        error: true,
        message: error.message || "Failed to book trip. Please try again.",
        data: null,
        status: error.response?.status || 500
      } as any;
    }
  },

  CANCEL_TRIP_BOOKING: async (
    bookingId: number
  ): Promise<CustomResponse<null>> => {
    try {
      const response = await DELETE(`${EventsBaseURL}/bookings/${bookingId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_USER_BOOKINGS: async (): Promise<CustomResponse<TripBookingResponse[]>> => {
    try {
      const response = await GET(`${EventsBaseURL}/my-bookings`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_EVENTS_STATS: async (): Promise<CustomResponse<any>> => {
    try {
      const response = await GET(`${EventsBaseURL}/admin/stats/events`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GET_TRIPS_STATS: async (): Promise<CustomResponse<any>> => {
    try {
      const response = await GET(`${EventsBaseURL}/admin/stats/trips`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
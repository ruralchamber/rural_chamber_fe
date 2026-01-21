import { GET, POST, PUT, DELETE } from "@/app/api/lib/client";
import { baseUrl } from "../../url";

const NetworkBaseURL = `${baseUrl}/network`;

export interface NetworkUser {
  id?: number;
  userId: number;
  email: string;
  fullName: string;
  companyName?: string;
  industry?: string;
  sector?: string;
  location?: string;
  profileVisibility: 'public' | 'private';
  isActive: boolean;
  accountType?: string;
  membershipType?: string;
  createdAt?: string;
  updatedAt?: string;
  networkProfileId?: number | null;
  connectionStatus?: {
    connected: boolean;
    status?: 'pending' | 'accepted' | 'rejected' | 'blocked' | 'no_network_profile';
    connectionId?: number;
  };
}

export interface NetworkUsersResponse {
  users: NetworkUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SendConnectionRequestData {
  targetUserId: number;
  message?: string;
}

export interface Connection {
  connectionId: number;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  message?: string;
  requestedAt: string;
  connectedAt?: string;
  isRequester: boolean;
  member: {
    id: number;
    userId: number;
    fullName: string;
    email: string;
    companyName?: string;
    industry?: string;
    sector?: string;
    location?: string;
  };
}

export interface PendingRequest {
  connectionId: number;
  status: 'pending';
  message?: string;
  requestedAt: string;
  requester: {
    id: number;
    userId: number;
    fullName: string;
    email: string;
    companyName?: string;
    industry?: string;
    sector?: string;
    location?: string;
  };
}

export interface BlockedUser {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  companyName?: string;
  industry?: string;
  blockedAt: string;
}

export interface NetworkStatistics {
  totalConnections: number;
  pendingRequests: number;
  blockedUsers: number;
  profileVisibility: 'public' | 'private';
  lastSync: string;
  networkGrowth: number;
}

export const NETWORK_API = {
  GET_NETWORK_USERS: async (params?: {
    search?: string;
    industry?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.industry) queryParams.append('industry', params.industry);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      const url = `${NetworkBaseURL}/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await GET(url);
      
      if (response.error) {
        return response;
      }
      
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  GET_MY_NETWORK_PROFILE: async () => {
    try {
      const response = await GET(`${NetworkBaseURL}/profile`);
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  SYNC_TO_NETWORK: async () => {
    try {
      const response = await POST(`${NetworkBaseURL}/sync`, {});
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  UPDATE_VISIBILITY: async (visibility: 'public' | 'private') => {
    try {
      const response = await PUT(`${NetworkBaseURL}/visibility`, { visibility });
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  GET_INDUSTRIES: async () => {
    try {
      const response = await GET(`${NetworkBaseURL}/industries`);
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  SEARCH_USERS: async (query: string) => {
    try {
      const url = `${NetworkBaseURL}/search?q=${encodeURIComponent(query)}`;
      const response = await GET(url);
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  SEND_CONNECTION_REQUEST: async (data: SendConnectionRequestData) => {
    try {
      const response = await POST(`${NetworkBaseURL}/connections/request`, data);
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  GET_MY_CONNECTIONS: async (status?: string) => {
    try {
      const url = status 
        ? `${NetworkBaseURL}/connections?status=${status}`
        : `${NetworkBaseURL}/connections`;
      
      const response = await GET(url);
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  GET_PENDING_REQUESTS: async () => {
    try {
      const response = await GET(`${NetworkBaseURL}/connections/pending`);
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  ACCEPT_CONNECTION_REQUEST: async (connectionId: number) => {
    try {
      const response = await PUT(`${NetworkBaseURL}/connections/${connectionId}/accept`, {});
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  REJECT_CONNECTION_REQUEST: async (connectionId: number) => {
    try {
      const response = await PUT(`${NetworkBaseURL}/connections/${connectionId}/reject`, {});
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  REMOVE_CONNECTION: async (connectionId: number) => {
    try {
      const response = await DELETE(`${NetworkBaseURL}/connections/${connectionId}`);
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  GET_CONNECTION_STATUS: async (targetUserId: number) => {
    try {
      const response = await GET(`${NetworkBaseURL}/connections/status/${targetUserId}`);
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  GET_NETWORK_STATISTICS: async () => {
    try {
      const response = await GET(`${NetworkBaseURL}/statistics`);
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  GET_CONNECTION_DETAILS: async (connectionId: number) => {
    try {
      const response = await GET(`${NetworkBaseURL}/connections/${connectionId}/details`);
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  GET_RECOMMENDATIONS: async () => {
    try {
      const response = await GET(`${NetworkBaseURL}/recommendations`);
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  BLOCK_USER: async (targetUserId: number) => {
    try {
      const response = await POST(`${NetworkBaseURL}/block`, { targetUserId });
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  UNBLOCK_USER: async (targetUserId: number) => {
    try {
      const response = await POST(`${NetworkBaseURL}/unblock`, { targetUserId });
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },

  GET_BLOCKED_USERS: async () => {
    try {
      const response = await GET(`${NetworkBaseURL}/blocked`);
      return response;
    } catch (error: any) {
      return { error: true, message: error.message, data: null };
    }
  },
};
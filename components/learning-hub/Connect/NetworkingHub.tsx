import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, UserCheck, UserX, Clock, Mail, Building2, MapPin, Filter, CheckCircle, XCircle, Info, Lock, Globe, Ban, Eye, MessageSquare, Sparkles, X, Shield, BarChart3 } from 'lucide-react';
import { NETWORK_API } from '@/app/api/endpoints/rest-api/network/network';

interface NetworkUser {
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
  networkProfileId?: number | null;
  connectionStatus?: {
    connected: boolean;
    status?: 'pending' | 'accepted' | 'rejected' | 'blocked' | 'no_network_profile';
    connectionId?: number;
  };
}

interface Connection {
  connectionId: number;
  status: string;
  message?: string;
  requestedAt: string;
  connectedAt?: string;
  isRequester: boolean;
  member?: {
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

interface PendingRequest {
  connectionId: number;
  status: string;
  message?: string;
  requestedAt: string;
  requester?: {
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

interface NetworkStatistics {
  totalConnections: number;
  pendingRequests: number;
  blockedUsers: number;
  profileVisibility: 'public' | 'private';
  lastSync: string;
  networkGrowth: number;
}

interface UserDetails {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  companyName?: string;
  industry?: string;
  sector?: string;
  location?: string;
  accountType?: 'individual' | 'organizational';
  membershipType?: string;
  registrationDate?: string;
  cellphone?: string;
  website?: string;
  about?: string;
  profileVisibility: 'public' | 'private';
}

interface BlockedUser {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  companyName?: string;
  industry?: string;
  blockedAt: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NetworkUserResponse {
  users: NetworkUser[];
  pagination?: {
    totalPages: number;
  };
}

interface ApiResponse<T> {
  error: boolean;
  data?: T;
  message?: string;
}

export function NetworkingHub() {
  const [users, setUsers] = useState<NetworkUser[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [activeTab, setActiveTab] = useState('directory');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [statistics, setStatistics] = useState<NetworkStatistics | null>(null);
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState<UserDetails | null>(null);
  const [recommendations, setRecommendations] = useState<NetworkUser[]>([]);
  const [showStatistics, setShowStatistics] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (activeTab === 'directory') {
        const response = await NETWORK_API.GET_NETWORK_USERS({
          page: currentPage,
          limit: 12,
          search: debouncedSearch || undefined,
          industry: selectedIndustry || undefined
        });
        
        if (!response.error && response.data) {
          const usersData = response.data.users || [];
          const paginationData = response.data.pagination || { totalPages: 1 };
          
          setUsers(usersData);
          setTotalPages(paginationData.totalPages || 1);
        } else {
          setError(response.message || 'Failed to fetch users');
          setUsers([]);
          setTotalPages(1);
        }
      }

      if (activeTab === 'connections') {
        const response = await NETWORK_API.GET_MY_CONNECTIONS();
        
        if (!response.error) {
          setConnections(response.data || []);
        } else {
          setError(response.message || 'Failed to fetch connections');
          setConnections([]);
        }
      }

      if (activeTab === 'requests') {
        const response = await NETWORK_API.GET_PENDING_REQUESTS();
        
        if (!response.error) {
          setPendingRequests(response.data || []);
        } else {
          setError(response.message || 'Failed to fetch pending requests');
          setPendingRequests([]);
        }
      }

      if (activeTab === 'blocked') {
        const response = await NETWORK_API.GET_BLOCKED_USERS();
        
        if (!response.error) {
          setBlockedUsers(response.data || []);
        } else {
          setError(response.message || 'Failed to fetch blocked users');
          setBlockedUsers([]);
        }
      }

      if (industries.length === 0 && activeTab === 'directory') {
        const response = await NETWORK_API.GET_INDUSTRIES();
        
        if (!response.error) {
          const industriesData = response.data || [];
          setIndustries(industriesData);
        }
      }

    } catch (error: any) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await NETWORK_API.GET_NETWORK_STATISTICS();
      if (!response.error && response.data) {
        setStatistics(response.data);
        setIsPrivateAccount(response.data.profileVisibility === 'private');
      }
    } catch (error) {}
  };

  const fetchRecommendations = async () => {
    try {
      const response = await NETWORK_API.GET_RECOMMENDATIONS();
      if (!response.error && response.data) {
        setRecommendations(response.data);
      }
    } catch (error) {}
  };

  const fetchBlockedUsers = async () => {
    try {
      const response = await NETWORK_API.GET_BLOCKED_USERS();
      if (!response.error && response.data) {
        setBlockedUsers(response.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchNetworkData();
    fetchStatistics();
    fetchRecommendations();
    fetchBlockedUsers();
  }, [currentPage, debouncedSearch, selectedIndustry, activeTab]);

  const handleConnect = async (targetUserId: number) => {
    try {
      const response = await NETWORK_API.SEND_CONNECTION_REQUEST({
        targetUserId,
        message: 'Hi, I would like to connect!'
      });
      
      if (!response.error) {
        showToast('Connection request sent successfully!', 'success');
        fetchNetworkData();
        fetchStatistics();
      } else {
        showToast(response.message || 'Failed to send connection request', 'error');
      }
    } catch (error) {
      showToast('Failed to send connection request', 'error');
    }
  };

  const handleAcceptRequest = async (connectionId: number) => {
    try {
      const response = await NETWORK_API.ACCEPT_CONNECTION_REQUEST(connectionId);
      
      if (!response.error) {
        showToast('Connection accepted!', 'success');
        fetchNetworkData();
        fetchStatistics();
      } else {
        showToast(response.message || 'Failed to accept connection', 'error');
      }
    } catch (error) {
      showToast('Failed to accept connection', 'error');
    }
  };

  const handleRejectRequest = async (connectionId: number) => {
    try {
      const response = await NETWORK_API.REJECT_CONNECTION_REQUEST(connectionId);
      
      if (!response.error) {
        showToast('Connection request rejected', 'info');
        fetchNetworkData();
        fetchStatistics();
      } else {
        showToast(response.message || 'Failed to reject connection', 'error');
      }
    } catch (error) {
      showToast('Failed to reject connection', 'error');
    }
  };

  const handleRemoveConnection = async (connectionId: number) => {
    try {
      const response = await NETWORK_API.REMOVE_CONNECTION(connectionId);
      
      if (!response.error) {
        showToast('Connection removed', 'info');
        fetchNetworkData();
        fetchStatistics();
      } else {
        showToast(response.message || 'Failed to remove connection', 'error');
      }
    } catch (error) {
      showToast('Failed to remove connection', 'error');
    }
  };

  const handleBlockUser = async (targetUserId: number) => {
    if (!window.confirm('Are you sure you want to block this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await NETWORK_API.BLOCK_USER(targetUserId);
      if (!response.error) {
        showToast('User blocked successfully', 'success');
        fetchNetworkData();
        fetchStatistics();
        fetchBlockedUsers();
      } else {
        showToast(response.message || 'Failed to block user', 'error');
      }
    } catch (error) {
      showToast('Failed to block user', 'error');
    }
  };

  const handleUnblockUser = async (targetUserId: number) => {
    try {
      const response = await NETWORK_API.UNBLOCK_USER(targetUserId);
      if (!response.error) {
        showToast('User unblocked successfully', 'success');
        fetchNetworkData();
        fetchStatistics();
        fetchBlockedUsers();
      } else {
        showToast(response.message || 'Failed to unblock user', 'error');
      }
    } catch (error) {
      showToast('Failed to unblock user', 'error');
    }
  };

  const fetchUserDetails = async (userId: number) => {
    try {
      setShowDetailsModal(true);
      const response = await NETWORK_API.GET_NETWORK_USERS({ limit: 100 });
      if (!response.error && response.data?.users) {
        const user = response.data.users.find((u: { userId: number; }) => u.userId === userId);
        if (user) {
          setSelectedUserDetails({
            ...user,
            accountType: user.accountType || 'individual',
            membershipType: user.membershipType || 'standard',
            registrationDate: user.createdAt || new Date().toISOString(),
            cellphone: '',
            website: '',
            about: ''
          });
        }
      }
    } catch (error) {
      showToast('Failed to load user details', 'error');
      setShowDetailsModal(false);
    }
  };

  const handleTogglePrivacy = async () => {
    try {
      const newVisibility = isPrivateAccount ? 'public' : 'private';
      const response = await NETWORK_API.UPDATE_VISIBILITY(newVisibility);
      
      if (!response.error) {
        setIsPrivateAccount(!isPrivateAccount);
        showToast(`Profile set to ${newVisibility}`, 'success');
        fetchStatistics();
      } else {
        showToast(response.message || 'Failed to update privacy', 'error');
      }
    } catch (error) {
      showToast('Failed to update privacy', 'error');
    }
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out animate-slide-in ${
            toast.type === 'success' ? 'bg-green-500 text-white' :
            toast.type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      ))}
    </div>
  );

  const StatisticsModal = () => (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#9FC93B] text-white rounded-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Network Statistics</h2>
                <p className="text-gray-600">Your networking overview</p>
              </div>
            </div>
            <button
              onClick={() => setShowStatistics(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {statistics && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-700">{statistics.totalConnections}</div>
                  <div className="text-sm text-blue-600">Connections</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-700">{statistics.pendingRequests}</div>
                  <div className="text-sm text-yellow-600">Pending Requests</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-red-700">{statistics.blockedUsers}</div>
                  <div className="text-sm text-red-600">Blocked Users</div>
                </div>
                <div className={`p-4 rounded-lg ${isPrivateAccount ? 'bg-purple-50' : 'bg-green-50'}`}>
                  <div className="text-3xl font-bold">{isPrivateAccount ? '🔒' : '🌐'}</div>
                  <div className={`text-sm ${isPrivateAccount ? 'text-purple-600' : 'text-green-600'}`}>
                    {isPrivateAccount ? 'Private' : 'Public'} Profile
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Profile Visibility</h3>
                <p className="text-gray-600">
                  {isPrivateAccount 
                    ? 'Only your connections can see your profile' 
                    : 'Your profile is visible to all members'}
                </p>
                <button
                  onClick={handleTogglePrivacy}
                  className={`mt-3 w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    isPrivateAccount
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isPrivateAccount ? 'Go Public' : 'Go Private'}
                </button>
              </div>

              <div className="text-sm text-gray-500">
                Last updated: {new Date(statistics.lastSync).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const MemberCard = ({ member, showActions = true }: { member: NetworkUser, showActions?: boolean }) => {
    const isConnected = member.connectionStatus?.connected;
    const isPending = member.connectionStatus?.status === 'pending';
    const isBlocked = member.connectionStatus?.status === 'blocked';
    
    return (
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchUserDetails(member.userId)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors group"
                title="View member details"
              >
                <Eye className="w-4 h-4 text-gray-500 group-hover:text-[#9FC93B]" />
              </button>
              <h3 
                className="font-semibold text-lg text-gray-900 truncate hover:text-[#9FC93B] cursor-pointer flex-1"
                onClick={() => fetchUserDetails(member.userId)}
              >
                {member.fullName}
              </h3>
            </div>
            {member.companyName && (
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1 truncate ml-9">
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="truncate">{member.companyName}</span>
              </div>
            )}
          </div>
          <div className="shrink-0 ml-2 flex flex-col items-end gap-1">
            {isConnected && <UserCheck className="w-5 h-5 text-green-600" />}
            {isPending && <Clock className="w-5 h-5 text-yellow-600" />}
            {isBlocked && <Ban className="w-5 h-5 text-red-600" />}
            {member.profileVisibility === 'private' && (
              <div className="relative group">
                <Lock className="w-4 h-4 text-gray-400" />
                <div className="absolute right-0 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Private Account
                </div>
              </div>
            )}
          </div>
        </div>

        {member.industry && (
          <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mb-2 truncate max-w-full ml-9">
            {member.industry}
          </div>
        )}

        {member.sector && (
          <div className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full mb-2 truncate max-w-full ml-9">
            {member.sector}
          </div>
        )}

        {member.location && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3 truncate ml-9">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{member.location}</span>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2">
          {showActions && !isConnected && !isPending && !isBlocked && (
            <>
              <button
                onClick={() => handleConnect(member.userId)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#9FC93B] text-white rounded-lg hover:bg-[#8AB82D] transition-colors text-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span className="whitespace-nowrap">Connect</span>
              </button>
              <button
                onClick={() => handleBlockUser(member.userId)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Ban className="w-4 h-4" />
                <span className="whitespace-nowrap">Block</span>
              </button>
            </>
          )}

          {showActions && isPending && (
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm"
            >
              <Clock className="w-4 h-4" />
              <span className="whitespace-nowrap">Request Pending</span>
            </button>
          )}

          {showActions && isConnected && (
            <>
              <button
                onClick={() => fetchUserDetails(member.userId)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                <Eye className="w-4 h-4" />
                <span className="whitespace-nowrap">View Details</span>
              </button>
              <button
                onClick={() => {
                  if (member.connectionStatus?.connectionId) {
                    if (window.confirm('Are you sure you want to remove this connection?')) {
                      handleRemoveConnection(member.connectionStatus.connectionId);
                    }
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
              >
                <UserX className="w-4 h-4" />
                <span className="whitespace-nowrap">Remove Connection</span>
              </button>
            </>
          )}

          {showActions && isBlocked && (
            <button
              onClick={() => handleUnblockUser(member.userId)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
            >
              <Shield className="w-4 h-4" />
              <span className="whitespace-nowrap">Unblock</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const ConnectionCard = ({ connection }: { connection: Connection }) => (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => connection.member?.userId && fetchUserDetails(connection.member.userId)}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors group"
              title="View member details"
            >
              <Eye className="w-4 h-4 text-gray-500 group-hover:text-[#9FC93B]" />
            </button>
            <h3 
              className="font-semibold text-lg text-gray-900 truncate hover:text-[#9FC93B] cursor-pointer flex-1"
              onClick={() => connection.member?.userId && fetchUserDetails(connection.member.userId)}
            >
              {connection.member?.fullName || 'Member'}
            </h3>
          </div>
          {connection.member?.companyName && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1 truncate ml-9">
              <Building2 className="w-4 h-4 shrink-0" />
              <span className="truncate">{connection.member.companyName}</span>
            </div>
          )}
        </div>
        <UserCheck className="w-5 h-5 text-green-600 shrink-0" />
      </div>

      {connection.member?.email && (
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3 truncate ml-9">
          <Mail className="w-4 h-4 shrink-0" />
          <span className="truncate">{connection.member.email}</span>
        </div>
      )}

      <div className="text-xs text-gray-500 mb-3 ml-9">
        Connected {new Date(connection.connectedAt || '').toLocaleDateString()}
      </div>

      <div className="mt-auto">
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to remove this connection?')) {
              handleRemoveConnection(connection.connectionId);
            }
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
        >
          <UserX className="w-4 h-4" />
          <span className="whitespace-nowrap">Remove Connection</span>
        </button>
      </div>
    </div>
  );

  const RequestCard = ({ request }: { request: PendingRequest }) => (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => request.requester?.userId && fetchUserDetails(request.requester.userId)}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors group"
              title="View member details"
            >
              <Eye className="w-4 h-4 text-gray-500 group-hover:text-[#9FC93B]" />
            </button>
            <h3 
              className="font-semibold text-lg text-gray-900 truncate hover:text-[#9FC93B] cursor-pointer flex-1"
              onClick={() => request.requester?.userId && fetchUserDetails(request.requester.userId)}
            >
              {request.requester?.fullName || 'Member'}
            </h3>
          </div>
          {request.requester?.companyName && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1 truncate ml-9">
              <Building2 className="w-4 h-4 shrink-0" />
              <span className="truncate">{request.requester.companyName}</span>
            </div>
          )}
        </div>
        <Clock className="w-5 h-5 text-yellow-600 shrink-0" />
      </div>

      {request.message && (
        <p className="text-sm text-gray-600 mb-3 italic truncate ml-9">"{request.message}"</p>
      )}

      <div className="text-xs text-gray-500 mb-3 ml-9">
        Requested {new Date(request.requestedAt).toLocaleDateString()}
      </div>

      <div className="mt-auto flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => handleAcceptRequest(request.connectionId)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          <UserCheck className="w-4 h-4" />
          Accept
        </button>
        <button
          onClick={() => handleRejectRequest(request.connectionId)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
        >
          <UserX className="w-4 h-4" />
          Decline
        </button>
      </div>
    </div>
  );

  const BlockedUserCard = ({ blockedUser }: { blockedUser: BlockedUser }) => (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 truncate">
            {blockedUser.fullName}
          </h3>
          {blockedUser.companyName && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1 truncate">
              <Building2 className="w-4 h-4 shrink-0" />
              <span className="truncate">{blockedUser.companyName}</span>
            </div>
          )}
        </div>
        <Ban className="w-5 h-5 text-red-600 shrink-0" />
      </div>

      {blockedUser.industry && (
        <div className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full mb-2 truncate max-w-full">
          {blockedUser.industry}
        </div>
      )}

      <div className="text-xs text-gray-500 mb-3">
        Blocked {new Date(blockedUser.blockedAt).toLocaleDateString()}
      </div>

      <div className="mt-auto">
        <button
          onClick={() => handleUnblockUser(blockedUser.userId)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
        >
          <Shield className="w-4 h-4" />
          <span className="whitespace-nowrap">Unblock User</span>
        </button>
      </div>
    </div>
  );

  const PrivacyToggle = () => (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${isPrivateAccount ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
          {isPrivateAccount ? (
            <Lock className="w-5 h-5" />
          ) : (
            <Globe className="w-5 h-5" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {isPrivateAccount ? 'Private Account' : 'Public Account'}
          </h3>
          <p className="text-sm text-gray-600">
            {isPrivateAccount 
              ? 'Only your connections can see your profile' 
              : 'Your profile is visible to all members'}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleTogglePrivacy}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isPrivateAccount
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isPrivateAccount ? 'Go Public' : 'Go Private'}
        </button>
        <button
          onClick={() => setShowStatistics(true)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <BarChart3 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const RecommendationsSection = () => (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">People You May Know</h2>
        <Sparkles className="w-5 h-5 text-yellow-500" />
      </div>
      
      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3">
          {recommendations.slice(0, 6).map((user) => (
            <MemberCard key={user.userId} member={user} />
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-600">
          <p>No recommendations available yet. Start connecting with people!</p>
        </div>
      )}
    </div>
  );

  const UserDetailsModal = () => {
    if (!selectedUserDetails) return null;

    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedUserDetails.fullName}</h2>
                <p className="text-gray-600">{selectedUserDetails.email}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Company Information</h3>
                  {selectedUserDetails.companyName && (
                    <p className="text-gray-700"><strong>Company:</strong> {selectedUserDetails.companyName}</p>
                  )}
                  {selectedUserDetails.industry && (
                    <p className="text-gray-700"><strong>Industry:</strong> {selectedUserDetails.industry}</p>
                  )}
                  {selectedUserDetails.sector && (
                    <p className="text-gray-700"><strong>Sector:</strong> {selectedUserDetails.sector}</p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                  {selectedUserDetails.location && (
                    <p className="text-gray-700"><strong>Location:</strong> {selectedUserDetails.location}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Membership Details</h3>
                  {selectedUserDetails.accountType && (
                    <p className="text-gray-700"><strong>Account Type:</strong> {selectedUserDetails.accountType}</p>
                  )}
                  {selectedUserDetails.membershipType && (
                    <p className="text-gray-700"><strong>Membership:</strong> {selectedUserDetails.membershipType}</p>
                  )}
                  {selectedUserDetails.registrationDate && (
                    <p className="text-gray-700">
                      <strong>Member Since:</strong> {new Date(selectedUserDetails.registrationDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Profile Settings</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">Visibility:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedUserDetails.profileVisibility === 'public'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {selectedUserDetails.profileVisibility === 'public' ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => {
                  if (selectedUserDetails.userId) {
                    handleConnect(selectedUserDetails.userId);
                  }
                  setShowDetailsModal(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#9FC93B] text-white rounded-lg hover:bg-[#8AB82D] transition-colors"
              >
                <UserPlus className="w-5 h-5" />
                Connect
              </button>
              
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TabButton = ({ tab, label }: { tab: string, label: string }) => {
    const getCount = () => {
      switch (tab) {
        case 'directory': return users.length;
        case 'connections': return connections.length;
        case 'requests': return pendingRequests.length;
        case 'blocked': return blockedUsers.length;
        default: return 0;
      }
    };

    const count = getCount();
    
    return (
      <button
        onClick={() => {
          setActiveTab(tab);
          setCurrentPage(1);
        }}
        className={`flex-1 px-2 py-3 sm:px-4 sm:py-4 font-medium text-sm sm:text-base transition-colors relative ${
          activeTab === tab
            ? 'text-[#9FC93B]'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <div className="flex flex-col items-center">
          <span className="whitespace-nowrap">{label}</span>
          <span className={`mt-1 px-2 py-0.5 text-xs rounded-full ${
            activeTab === tab 
              ? 'bg-[#9FC93B] text-white' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {count}
          </span>
        </div>
        {activeTab === tab && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9FC93B]"></div>
        )}
      </button>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      <ToastContainer />
      
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

      <div className="bg-white rounded-lg shadow-sm sm:shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-gray-900">Business Network</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Connect with fellow members to grow your business network
        </p>

        {pendingRequests.length > 0 && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs sm:text-sm text-yellow-800">
              You have {pendingRequests.length} pending connection request{pendingRequests.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      <PrivacyToggle />

      {activeTab === 'directory' && recommendations.length > 0 && <RecommendationsSection />}

      <div className="bg-white rounded-lg shadow-sm sm:shadow-md mb-4 sm:mb-6 overflow-hidden">
        <div className="flex border-b">
          <TabButton tab="directory" label="Directory" />
          <TabButton tab="connections" label="Connections" />
          <TabButton tab="requests" label="Requests" />
          <TabButton tab="blocked" label="Blocked" />
        </div>
      </div>

      {activeTab === 'directory' && (
        <div className="bg-white rounded-lg shadow-sm sm:shadow-md p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search by name, company, industry, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm sm:text-base"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <select
                value={selectedIndustry}
                onChange={(e) => {
                  setSelectedIndustry(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-48 pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FC93B] appearance-none text-sm sm:text-base bg-white"
              >
                <option value="">All Industries</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-red-800 text-sm sm:text-base">{error}</p>
          <button
            onClick={() => fetchNetworkData()}
            className="mt-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs sm:text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#9FC93B]"></div>
        </div>
      ) : (
        <>
          {activeTab === 'directory' && (
            <>
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {users.length > 0 ? (
                  users.map((user) => (
                    <MemberCard key={user.userId} member={user} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 sm:py-12">
                    <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <p className="text-gray-600 text-sm sm:text-base mb-2">No members found</p>
                    {searchTerm || selectedIndustry ? (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedIndustry('');
                          setCurrentPage(1);
                        }}
                        className="mt-3 sm:mt-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-[#9FC93B] text-white rounded-lg hover:bg-[#8AB82D] transition-colors text-sm sm:text-base"
                      >
                        Clear Filters
                      </button>
                    ) : (
                      <button
                        onClick={() => fetchNetworkData()}
                        className="mt-3 sm:mt-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-[#9FC93B] text-white rounded-lg hover:bg-[#8AB82D] transition-colors text-sm sm:text-base"
                      >
                        Refresh
                      </button>
                    )}
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-xs sm:text-sm"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-xs sm:text-sm"
                    >
                      Next
                    </button>
                  </div>
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              )}
            </>
          )}

          {activeTab === 'connections' && (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {connections.length > 0 ? (
                connections.map((connection) => (
                  <ConnectionCard key={connection.connectionId} connection={connection} />
                ))
              ) : (
                <div className="col-span-full text-center py-8 sm:py-12">
                  <UserCheck className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-600 text-sm sm:text-base mb-2">No connections yet</p>
                  <button
                    onClick={() => setActiveTab('directory')}
                    className="mt-3 sm:mt-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-[#9FC93B] text-white rounded-lg hover:bg-[#8AB82D] transition-colors text-sm sm:text-base"
                  >
                    Browse Directory
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <RequestCard key={request.connectionId} request={request} />
                ))
              ) : (
                <div className="col-span-full text-center py-8 sm:py-12">
                  <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-600 text-sm sm:text-base">No pending requests</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'blocked' && (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {blockedUsers.length > 0 ? (
                blockedUsers.map((blockedUser) => (
                  <BlockedUserCard key={blockedUser.id} blockedUser={blockedUser} />
                ))
              ) : (
                <div className="col-span-full text-center py-8 sm:py-12">
                  <Ban className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-600 text-sm sm:text-base">No blocked users</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {showDetailsModal && <UserDetailsModal />}
      {showStatistics && <StatisticsModal />}
    </div>
  );
}
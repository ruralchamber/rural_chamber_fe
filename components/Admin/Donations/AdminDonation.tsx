"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Shield,
  ExternalLink,
  ArrowLeft,
  User,
  FileText,
  CalendarDays,
  CreditCard,
  Globe,
  Phone,
  MessageSquare,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { DONATION_API } from '@/app/api/endpoints/rest-api/donation/donation';

interface Donation {
  id: number;
  donorFirstName: string;
  donorLastName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  purpose: string;
  donationType: 'one-time' | 'recurring';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'cancelled';
  isAnonymous: boolean;
  isRecurring: boolean;
  recurrenceFrequency?: string;
  paymentDate?: string;
  createdAt: string;
  receiptNumber?: string;
  paymentReference: string;
  notes?: string;
  currency: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
  };
}

interface DonationStats {
  totalDonations: number;
  totalAmount: number;
  oneTimeDonations: number;
  recurringDonations: number;
  donationsByPurpose: Array<{
    purpose: string;
    count: number;
    totalAmount: number;
  }>;
}

function DonationsPageContent() {
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [sendingReceipt, setSendingReceipt] = useState<number | null>(null);
  
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadDonations();
    loadStats();
  }, [currentPage, selectedStatus, selectedPurpose, dateRange]);

  const loadDonations = async () => {
    try {
      setLoading(true);
      
      const response = await DONATION_API.GET_ALL_DONATIONS(currentPage, 20, {
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        purpose: selectedPurpose !== 'all' ? selectedPurpose : undefined,
        startDate: dateRange.start ? new Date(dateRange.start) : undefined,
        endDate: dateRange.end ? new Date(dateRange.end) : undefined
      });

      if (!response.error) {
        setDonations(response.data?.donations || []);
        setTotalPages(response.data?.totalPages || 1);
      } else {
        if (response.status === 401 || response.status === 403) {
          toast.error('Admin access required. Please login again.');
          localStorage.removeItem('admin_access_token');
          localStorage.removeItem('admin_info');
          router.push('/auth/login');
        } else {
          toast.error(response.message || 'Failed to load donations');
        }
      }
    } catch (error) {
      toast.error('Failed to load donations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await DONATION_API.GET_DONATION_STATS();
      if (!response.error) {
        setStats(response.data);
      } else {
        if (response.status === 401 || response.status === 403) {
          toast.error('Admin access required');
          router.push('/auth/login');
        }
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const filteredDonations = donations.filter(donation => {
    const searchLower = searchQuery.toLowerCase();
    return (
      donation.donorFirstName?.toLowerCase().includes(searchLower) ||
      donation.donorLastName?.toLowerCase().includes(searchLower) ||
      donation.donorEmail?.toLowerCase().includes(searchLower) ||
      donation.receiptNumber?.toLowerCase().includes(searchLower) ||
      donation.paymentReference?.toLowerCase().includes(searchLower) ||
      donation.amount.toString().includes(searchQuery)
    );
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateLong = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: any }> = {
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      failed: { color: 'bg-red-100 text-red-800', icon: XCircle },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };

    const statusConfig = config[status] || config.pending;
    const IconComponent = statusConfig.icon;

    return (
      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
        <IconComponent className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const getPurposeBadge = (purpose: string) => {
    const colors: Record<string, string> = {
      general: 'bg-blue-100 text-blue-800',
      education: 'bg-purple-100 text-purple-800',
      community: 'bg-green-100 text-green-800',
      business: 'bg-amber-100 text-amber-800',
      infrastructure: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[purpose] || colors.other}`}>
        {purpose.charAt(0).toUpperCase() + purpose.slice(1)}
      </span>
    );
  };

  const exportToCSV = async () => {
    try {
      setExporting(true);
      const response = await DONATION_API.GET_ALL_DONATIONS(1, 1000);
      
      if (response.error) {
        throw new Error(response.message || 'Failed to export data');
      }
      
      const donations = response.data?.donations || [];
      const headers = [
        'Receipt Number',
        'Date',
        'Donor Name',
        'Email',
        'Amount',
        'Purpose',
        'Type',
        'Status',
        'Anonymous',
        'Recurring',
        'Frequency',
        'Payment Reference'
      ];

      const csvData = donations.map(d => [
        d.receiptNumber || 'N/A',
        new Date(d.createdAt).toLocaleDateString('en-ZA'),
        d.isAnonymous ? 'Anonymous' : `${d.donorFirstName} ${d.donorLastName}`,
        d.donorEmail,
        formatCurrency(d.amount),
        d.purpose,
        d.donationType,
        d.paymentStatus,
        d.isAnonymous ? 'Yes' : 'No',
        d.isRecurring ? 'Yes' : 'No',
        d.recurrenceFrequency || 'N/A',
        d.paymentReference
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Donations exported successfully');
    } catch (error) {
      toast.error('Failed to export donations');
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  const sendReceipt = async (donationId: number) => {
    try {
      setSendingReceipt(donationId);
      const response = await DONATION_API.SEND_RECEIPT(donationId);
      
      if (!response.error) {
        toast.success('Receipt sent successfully');
      } else {
        if (response.status === 401 || response.status === 403) {
          toast.error('Admin access required');
          router.push('/auth/login');
        } else {
          throw new Error(response.message || 'Failed to send receipt');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send receipt');
      console.error(error);
    } finally {
      setSendingReceipt(null);
    }
  };

  const viewDonationDetails = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedDonation(null);
    }, 300);
  };

  const handleModalSendReceipt = async () => {
    if (!selectedDonation) return;
    
    try {
      setSendingReceipt(selectedDonation.id);
      const response = await DONATION_API.SEND_RECEIPT(selectedDonation.id);
      
      if (!response.error) {
        toast.success('Receipt sent successfully');
      } else {
        if (response.status === 401 || response.status === 403) {
          toast.error('Admin access required');
          router.push('/auth/login');
        } else {
          throw new Error(response.message || 'Failed to send receipt');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send receipt');
      console.error(error);
    } finally {
      setSendingReceipt(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Donations Management</h1>
              <p className="text-gray-600 text-sm mt-1 hidden sm:block">View and manage all donations</p>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="sm:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Dashboard
            </button>
            <button
              onClick={exportToCSV}
              disabled={exporting}
              className="px-4 py-2 bg-[#01311B] text-white rounded-lg hover:bg-[#024d2f] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
            >
              <Download className="h-4 w-4" />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-4 sm:px-6 py-6">
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow p-4 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Donations</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stats.totalDonations}</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow p-4 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(stats.totalAmount)}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow p-4 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">One-Time Donations</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stats.oneTimeDonations}</p>
                </div>
                <div className="p-2 sm:p-3 bg-purple-50 rounded-lg">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow p-4 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Recurring Donations</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stats.recurringDonations}</p>
                </div>
                <div className="p-2 sm:p-3 bg-amber-50 rounded-lg">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search donations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
              <select
                value={selectedPurpose}
                onChange={(e) => setSelectedPurpose(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent"
              >
                <option value="all">All Purposes</option>
                <option value="general">General</option>
                <option value="education">Education</option>
                <option value="community">Community</option>
                <option value="business">Business</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent text-sm"
                  />
                  <div className="text-xs text-gray-500 mt-1 text-center">From</div>
                </div>
                <div>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent text-sm"
                  />
                  <div className="text-xs text-gray-500 mt-1 text-center">To</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9FC93B]"></div>
            </div>
          ) : (
            <>
            
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Donor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDonations.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <div className="text-gray-500">No donations found</div>
                        </td>
                      </tr>
                    ) : (
                      filteredDonations.map((donation) => (
                        <tr key={donation.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {donation.isAnonymous ? (
                                    <div className="flex items-center gap-2">
                                      <Shield className="h-4 w-4 text-gray-400" />
                                      <span>Anonymous Donor</span>
                                    </div>
                                  ) : (
                                    `${donation.donorFirstName} ${donation.donorLastName}`
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {donation.donorEmail}
                                </div>
                                {donation.user && (
                                  <div className="text-xs text-blue-600 mt-1">
                                    Member #{donation.user.id}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  {formatCurrency(donation.amount)}
                                </span>
                                {donation.isRecurring && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                    🔁 {donation.recurrenceFrequency}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {getPurposeBadge(donation.purpose)}
                                <span className="text-xs text-gray-500">
                                  {donation.donationType === 'recurring' ? 'Recurring' : 'One-time'}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(donation.paymentDate || donation.createdAt)}
                              </div>
                              <div className="text-xs text-gray-400 font-mono">
                                {donation.receiptNumber}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-2">
                              {getStatusBadge(donation.paymentStatus)}
                              {donation.paymentReference && (
                                <div className="text-xs text-gray-500 truncate max-w-[150px]">
                                  Ref: {donation.paymentReference}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              {/* <button
                                onClick={() => sendReceipt(donation.id)}
                                disabled={sendingReceipt === donation.id}
                                className="p-2 text-gray-600 hover:text-[#9FC93B] transition-colors disabled:opacity-50"
                                title="Send Receipt"
                              >
                                {sendingReceipt === donation.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#9FC93B]"></div>
                                ) : (
                                  <Mail className="h-4 w-4" />
                                )}
                              </button> */}
                              <button
                                onClick={() => viewDonationDetails(donation)}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  window.open(`https://dashboard.paystack.com/#/transactions/${donation.paymentReference}`, '_blank');
                                }}
                                className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                                title="View on Paystack"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="lg:hidden">
                {filteredDonations.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="text-gray-500">No donations found</div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredDonations.map((donation) => (
                      <div key={donation.id} className="p-4 hover:bg-gray-50">
                       
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {donation.isAnonymous ? (
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-gray-400" />
                                  <span className="font-medium text-gray-900">Anonymous Donor</span>
                                </div>
                              ) : (
                                <h3 className="font-medium text-gray-900">
                                  {donation.donorFirstName} {donation.donorLastName}
                                </h3>
                              )}
                              {donation.user && (
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                  Member #{donation.user.id}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">{donation.donorEmail}</p>
                          </div>

                          <div className="flex items-center gap-1 ml-2">
                            {/* <button
                              onClick={() => sendReceipt(donation.id)}
                              disabled={sendingReceipt === donation.id}
                              className="p-1.5 text-gray-600 hover:text-[#9FC93B] transition-colors disabled:opacity-50"
                              title="Send Receipt"
                            >
                              {sendingReceipt === donation.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#9FC93B]"></div>
                              ) : (
                                <Mail className="h-4 w-4" />
                              )}
                            </button> */}
                            <button
                              onClick={() => viewDonationDetails(donation)}
                              className="p-1.5 text-gray-600 hover:text-blue-600 transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">
                                {formatCurrency(donation.amount)}
                              </span>
                              {donation.isRecurring && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                  🔁 {donation.recurrenceFrequency}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {donation.donationType === 'recurring' ? 'Recurring' : 'One-time'}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {getPurposeBadge(donation.purpose)}
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            {formatDate(donation.paymentDate || donation.createdAt)}
                          </div>
                          
                          <div className="text-xs text-gray-400 font-mono">
                            {donation.receiptNumber}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div>
                            {getStatusBadge(donation.paymentStatus)}
                            {donation.paymentReference && (
                              <div className="text-xs text-gray-500 mt-1 truncate">
                                Ref: {donation.paymentReference}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              window.open(`https://dashboard.paystack.com/#/transactions/${donation.paymentReference}`, '_blank');
                            }}
                            className="p-1.5 text-gray-600 hover:text-purple-600 transition-colors"
                            title="View on Paystack"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isModalOpen && selectedDonation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center backdrop-blur-xs min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
       
            <div 
              className="fixed inset-0 transition-opacity bg-opacity-50"
              onClick={closeModal}
            ></div>

            <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
             
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Donation Details
                      </h3>
                      <p className="text-sm text-gray-500">
                        Receipt: {selectedDonation.receiptNumber || 'Not generated'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 
                  <div className="space-y-6">
                   
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Donor Information
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        {selectedDonation.isAnonymous ? (
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">Anonymous Donor</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Name</span>
                              <span className="text-sm font-medium text-gray-900">
                                {selectedDonation.donorFirstName} {selectedDonation.donorLastName}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Email</span>
                              <span className="text-sm font-medium text-gray-900">
                                {selectedDonation.donorEmail}
                              </span>
                            </div>
                            {selectedDonation.donorPhone && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Phone</span>
                                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {selectedDonation.donorPhone}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                        {selectedDonation.user && (
                          <div className="pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Member ID</span>
                              <span className="text-sm font-medium text-blue-600">
                                #{selectedDonation.user.id}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Member Name</span>
                              <span className="text-sm font-medium text-gray-900">
                                {selectedDonation.user.fullName}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Member Email</span>
                              <span className="text-sm font-medium text-gray-900">
                                {selectedDonation.user.email}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Payment Information
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Amount</span>
                          <span className="text-lg font-bold text-[#01311B]">
                            {formatCurrency(selectedDonation.amount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Currency</span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedDonation.currency || 'ZAR'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Payment Reference</span>
                          <span className="text-sm font-medium text-gray-900 font-mono">
                            {selectedDonation.paymentReference}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Payment Gateway</span>
                          <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            Paystack
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                   
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Donation Details
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Purpose</span>
                          <div>
                            {getPurposeBadge(selectedDonation.purpose)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Type</span>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              selectedDonation.donationType === 'recurring' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {selectedDonation.donationType === 'recurring' ? 'Recurring' : 'One-time'}
                            </span>
                            {selectedDonation.isRecurring && selectedDonation.recurrenceFrequency && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {selectedDonation.recurrenceFrequency}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <div>
                            {getStatusBadge(selectedDonation.paymentStatus)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Anonymous</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            selectedDonation.isAnonymous 
                              ? 'bg-gray-100 text-gray-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {selectedDonation.isAnonymous ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        Timeline
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">Created</div>
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            {formatDateLong(selectedDonation.createdAt)}
                          </div>
                        </div>
                        {selectedDonation.paymentDate && (
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500">Payment Date</div>
                            <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-green-500" />
                              {formatDateLong(selectedDonation.paymentDate)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedDonation.notes && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Notes
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{selectedDonation.notes}</p>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end border-t border-gray-200 pt-6">
                  <button
                    onClick={handleModalSendReceipt}
                    disabled={sendingReceipt === selectedDonation.id}
                    className="px-4 py-2 bg-[#9FC93B] text-white rounded-lg hover:bg-[#8db834] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingReceipt === selectedDonation.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        Send Receipt
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      window.open(`https://dashboard.paystack.com/#/transactions/${selectedDonation.paymentReference}`, '_blank');
                    }}
                    className="px-4 py-2 border border-[#01311B] text-[#01311B] rounded-lg hover:bg-[#01311B] hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on Paystack
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDonationsPage() {
  return <DonationsPageContent />;
}
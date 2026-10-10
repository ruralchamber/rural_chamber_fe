/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  DollarSign,
  LogOut,
  Home,
  Users,
  Mail,
  TrendingUp,
  RefreshCw,
  UserCheck,
  CreditCard,
  AlertCircle,
  UserPlus,
  Clock,
  Eye} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { DASHBOARD_API } from '@/app/api/endpoints/rest-api/dashboard/dashboard';
import { useAuth } from '@/context/AuthContext';
import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoutes';

function AdminDashboardContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'renewals'>('overview');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await DASHBOARD_API.GET_DASHBOARD_STATS();

      if (!response.error && response.data) {
        setStats(response.data);
      } else {
        toast.error('Failed to load dashboard statistics');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardStats();
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return 'R 0';
    }
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (isNaN(num) || num === null || num === undefined) {
      return '0';
    }
    return new Intl.NumberFormat('en-ZA').format(num);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSubscriptionTierColor = (tier: string) => {
    if (!tier) return 'bg-gray-100 text-gray-800';
    if (tier.includes('platinum')) return 'bg-purple-100 text-purple-800';
    if (tier.includes('gold')) return 'bg-yellow-100 text-yellow-800';
    if (tier.includes('silver')) return 'bg-gray-100 text-gray-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getSubscriptionTierLabel = (tier: string) => {
    if (!tier || tier === 'free') return 'Free';
    return tier.replace(/_/g, ' ');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getRenewalStatusColor = (days: number) => {
    if (days < 0) return 'text-red-600 bg-red-50';
    if (days <= 7) return 'text-orange-600 bg-orange-50';
    if (days <= 30) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const menuItems = [
    {
      title: "Events Management",
      description: "Create, view and manage events",
      icon: Calendar,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      onClick: () => router.push('/admin/events')
    },
    {
      title: "Donations Management",
      description: "View and manage all donations",
      icon: DollarSign,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      onClick: () => router.push('/admin/donations')
    },
    {
      title: "Users Management",
      description: "Manage registered users",
      icon: Users,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      onClick: () => router.push('/admin/users')
    },
    {
      title: "Subscribers",
      description: "Email subscribers list",
      icon: Mail,
      color: "bg-amber-500",
      hoverColor: "hover:bg-amber-600",
      onClick: () => toast.info('Coming soon!')
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const upcomingRenewals = stats?.users?.upcomingRenewals || [];
  const totalRenewalValue = upcomingRenewals.reduce((sum: number, r: any) => {
    const amount = typeof r.amount === 'number' ? r.amount : parseFloat(r.amount) || 0;
    return sum + amount;
  }, 0);

  const renewalsThisWeek = upcomingRenewals.filter((r: any) => r.daysUntilRenewal <= 7 && r.daysUntilRenewal >= 0).length;
  const renewalsThisMonth = upcomingRenewals.filter((r: any) => r.daysUntilRenewal <= 30 && r.daysUntilRenewal >= 0).length;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="w-10 h-10 bg-linear-to-r from-[#01311B] to-[#9FC93B] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">
                  Welcome back, {user?.fullName || 'Admin'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline text-sm font-medium">Refresh</span>
              </button>

              <button
                onClick={() => router.push('/connect-hub')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="text-sm font-medium">Visit Site</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>

          <div className="flex space-x-4 mt-2">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${selectedTab === 'overview'
                  ? 'text-[#01311B] border-b-2 border-[#9FC93B]'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab('users')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${selectedTab === 'users'
                  ? 'text-[#01311B] border-b-2 border-[#9FC93B]'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Users & Subscriptions
            </button>
            <button
              onClick={() => setSelectedTab('renewals')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${selectedTab === 'renewals'
                  ? 'text-[#01311B] border-b-2 border-[#9FC93B]'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Upcoming Renewals
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedTab === 'overview' && 'Welcome to Admin Panel'}
                {selectedTab === 'users' && 'User Management Overview'}
                {selectedTab === 'renewals' && 'Subscription Renewals'}
              </h2>
              <p className="text-gray-600 mt-2">
                {selectedTab === 'overview' && 'Manage your website content, events, and donations from one place'}
                {selectedTab === 'users' && 'View and manage registered users and their subscription details'}
                {selectedTab === 'renewals' && 'Track upcoming subscription renewals and payment dates'}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(stats?.overview?.totalRevenue || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-gray-500">
                From {formatNumber(stats?.donations?.totalDonations || 0)} donations
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Members</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatNumber(stats?.users?.totals?.totalUsers || 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500">
                {formatNumber(stats?.users?.totals?.verifiedUsers || 0)} verified • {formatNumber(stats?.users?.totals?.completedRegistrations || 0)} completed
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatNumber(stats?.overview?.activeSubscriptions || 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500">
                {upcomingRenewals.length || 0} renewals due soon
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Events</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatNumber(stats?.overview?.activeEvents || 0)}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500">
                {formatNumber(stats?.events?.totalEvents || 0)} total events
              </p>
            </div>
          </motion.div>
        </div>

        {selectedTab === 'overview' && (
          <>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6 cursor-pointer"
                  onClick={() => router.push('/admin/events')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold">Create New Event</h4>
                      <p className="text-blue-100 mt-1">Schedule a new event</p>
                    </div>
                    <Calendar className="h-8 w-8" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-linear-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6 cursor-pointer"
                  onClick={() => router.push('/admin/users')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold">Manage Users</h4>
                      <p className="text-purple-100 mt-1">View all registered members</p>
                    </div>
                    <Users className="h-8 w-8" />
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Management Sections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={item.onClick}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 ${item.color} rounded-lg`}>
                          <item.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <div className={`px-6 py-3 ${item.color} bg-opacity-10 border-t border-gray-100`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Click to open</span>
                        <div className="text-gray-400">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Donations by Purpose</h3>
                <div className="space-y-4">
                  {stats?.donations?.donationsByPurpose?.length > 0 ? (
                    stats.donations.donationsByPurpose.map((purpose: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {purpose.purpose.replace('-', ' ')}
                            </span>
                            <span className="text-sm font-semibold text-green-600">
                              {formatCurrency(purpose.totalAmount)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${(purpose.totalAmount / (stats.donations.totalAmount || 1)) * 100}%`
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">{purpose.count} donations</span>
                            <span className="text-xs text-gray-500">
                              {((purpose.totalAmount / (stats.donations.totalAmount || 1)) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No donation data available</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Distribution</h3>
                <div className="space-y-4">
                  {stats?.users?.breakdowns?.bySubscriptionTier?.length > 0 ? (
                    stats.users.breakdowns.bySubscriptionTier.map((tier: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {tier.tier.replace('_', ' ')}
                            </span>
                            <span className="text-sm font-semibold text-purple-600">
                              {tier.count} members
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{
                                width: `${(tier.count / (stats.users.totals.totalUsers || 1)) * 100}%`
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              {((tier.count / (stats.users.totals.totalUsers || 1)) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No subscription data available</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'users' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(stats?.users?.totals?.totalUsers || 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Verified Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(stats?.users?.totals?.verifiedUsers || 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {((stats?.users?.totals?.verifiedUsers / (stats?.users?.totals?.totalUsers || 1)) * 100).toFixed(1)}% of total
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Completed Registrations</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(stats?.users?.totals?.completedRegistrations || 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <UserPlus className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Subscriptions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(stats?.users?.totals?.activeSubscriptions || 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <CreditCard className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats?.users?.recentUsers?.map((user: any) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                          {user.membershipNumber && (
                            <div className="text-xs text-gray-500">ID: {user.membershipNumber}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSubscriptionTierColor(user.subscriptionTier)}`}>
                            {getSubscriptionTierLabel(user.subscriptionTier)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user.emailVerified ? (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                <UserCheck className="h-3 w-3" />
                                Verified
                              </span>
                            ) : (
                              <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Pending
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="block md:hidden divide-y divide-gray-200">
                {stats?.users?.recentUsers?.map((user: any) => (
                  <div
                    key={user.id}
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{user.fullName}</h3>
                        {user.membershipNumber && (
                          <p className="text-xs text-gray-500 mt-0.5">ID: {user.membershipNumber}</p>
                        )}
                      </div>
                      <Eye className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSubscriptionTierColor(user.subscriptionTier)}`}>
                            {getSubscriptionTierLabel(user.subscriptionTier)}
                          </span>

                          {user.emailVerified ? (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                              <UserCheck className="h-3 w-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Pending
                            </span>
                          )}
                        </div>

                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(user.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 border-t border-gray-200">
                <button
                  onClick={() => router.push('/admin/users')}
                  className="text-sm text-[#01311B] hover:text-[#9FC93B] font-medium"
                >
                  View all users →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Subscription Tier</h3>
                <div className="space-y-4">
                  {stats?.users?.breakdowns?.bySubscriptionTier?.map((tier: any) => (
                    <div key={tier.tier} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {getSubscriptionTierLabel(tier.tier)}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{tier.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Types</h3>
                <div className="space-y-4">
                  {stats?.registrations?.accountTypes?.map((type: any) => (
                    <div key={type.type} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 capitalize">{type.type}</span>
                      <span className="text-sm font-semibold text-gray-900">{type.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'renewals' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Due This Week</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {renewalsThisWeek}
                    </p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Due This Month</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {renewalsThisMonth}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Renewal Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(totalRenewalValue)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Subscription Renewals</h3>
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Billing</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {upcomingRenewals.map((renewal: any) => (
                      <tr
                        key={renewal.userId}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => router.push(`/admin/users/${renewal.userId}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{renewal.userName}</div>
                            <div className="text-xs text-gray-500">{renewal.userEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSubscriptionTierColor(renewal.subscriptionType)}`}>
                            {getSubscriptionTierLabel(renewal.subscriptionType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(renewal.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(renewal.nextBillingDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${renewal.daysUntilRenewal < 0 ? 'text-red-600' :
                              renewal.daysUntilRenewal <= 7 ? 'text-orange-600' :
                                renewal.daysUntilRenewal <= 30 ? 'text-yellow-600' :
                                  'text-green-600'
                            }`}>
                            {renewal.daysUntilRenewal < 0
                              ? `${Math.abs(renewal.daysUntilRenewal)} days overdue`
                              : `${renewal.daysUntilRenewal} days`}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="block md:hidden divide-y divide-gray-200">
                {upcomingRenewals.map((renewal: any) => (
                  <div
                    key={renewal.userId}
                    onClick={() => router.push(`/admin/users/${renewal.userId}`)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{renewal.userName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{renewal.userEmail}</p>
                      </div>
                      <Eye className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSubscriptionTierColor(renewal.subscriptionType)}`}>
                          {getSubscriptionTierLabel(renewal.subscriptionType)}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(renewal.amount)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(renewal.nextBillingDate)}
                        </div>
                        <div className={`text-sm font-medium ${renewal.daysUntilRenewal < 0 ? 'text-red-600' :
                            renewal.daysUntilRenewal <= 7 ? 'text-orange-600' :
                              renewal.daysUntilRenewal <= 30 ? 'text-yellow-600' :
                                'text-green-600'
                          }`}>
                          {renewal.daysUntilRenewal < 0
                            ? `${Math.abs(renewal.daysUntilRenewal)} days overdue`
                            : `${renewal.daysUntilRenewal} days`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} Rural Chamber Admin Dashboard. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <p className="text-sm text-gray-600">
                Data updated in real-time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminProtectedRoute>
      <AdminDashboardContent />
    </AdminProtectedRoute>
  );
}
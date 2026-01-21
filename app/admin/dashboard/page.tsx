// app/admin/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, DollarSign, LogOut, Home, Users, Mail, TrendingUp, RefreshCw } from 'lucide-react';
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
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-ZA').format(num);
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
      onClick: () => toast.info('Coming soon!')
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

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
  
      <div className="bg-white border-b border-gray-200 shadow-sm">
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
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Admin Panel</h2>
              <p className="text-gray-600 mt-2">
                Manage your website content, events, and donations from one place
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
                  {stats ? formatCurrency(stats.overview?.totalRevenue || 0) : 'R 0'}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-gray-500">
                From {stats?.donations?.totalDonations || 0} donations
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
                <p className="text-sm text-gray-500">Registered Members</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats ? formatNumber(stats.registrations?.totalRegistrations || 0) : '0'}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500">
                {stats?.registrations?.verifiedUsers || 0} verified • {stats?.registrations?.completedRegistrations || 0} completed
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
                <p className="text-sm text-gray-500">Email Subscribers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats ? formatNumber(stats.overview?.totalSubscribers || 0) : '0'}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Mail className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500">
                +{stats?.subscribers?.thisMonth || 0} this month
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
                  {stats ? formatNumber(stats.overview?.activeEvents || 0) : '0'}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500">
                {stats?.events?.totalEvents || 0} total events
              </p>
            </div>
          </motion.div>
        </div>

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
              className="bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6 cursor-pointer"
              onClick={() => router.push('/admin/donations')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold">View Donations</h4>
                  <p className="text-green-100 mt-1">Check latest donations</p>
                </div>
                <DollarSign className="h-8 w-8" />
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership Distribution</h3>
            <div className="space-y-4">
              {stats?.registrations?.membershipTypes?.length > 0 ? (
                stats.registrations.membershipTypes.map((type: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {type.type.replace('-', ' ').replace('_', ' ')}
                        </span>
                        <span className="text-sm font-semibold text-blue-600">
                          {type.count} members
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ 
                            width: `${(type.count / (stats.registrations.totalRegistrations || 1)) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {((type.count / (stats.registrations.totalRegistrations || 1)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No membership data available</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats ? (
              <>
                {stats.donations?.totalDonations > 0 && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Total Donations Received</p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(stats.donations.totalAmount)} from {stats.donations.totalDonations} donations
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        {stats.donations.oneTimeDonations} one-time, {stats.donations.recurringDonations} recurring
                      </p>
                    </div>
                  </div>
                )}
                
                {stats.registrations?.totalRegistrations > 0 && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Registered Members</p>
                        <p className="text-xs text-gray-500">
                          {stats.registrations.totalRegistrations} total registrations
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-blue-600">
                        +{stats.registrations.thisMonth} this month
                      </p>
                      <p className="text-xs text-gray-500">
                        {stats.registrations.verifiedUsers} verified
                      </p>
                    </div>
                  </div>
                )}
                
                {stats.subscribers?.totalSubscribers > 0 && (
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email Subscribers</p>
                        <p className="text-xs text-gray-500">
                          {stats.subscribers.totalSubscribers} active subscribers
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-amber-600">
                        +{stats.subscribers.thisMonth} this month
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-center py-4">No activity data available</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 py-6">
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

// Wrap the dashboard with AdminProtectedRoute
export default function AdminDashboard() {
  return (
    <AdminProtectedRoute>
      <AdminDashboardContent />
    </AdminProtectedRoute>
  );
}
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    ChevronLeft,
    RefreshCw,
    UserCheck,
    AlertCircle,
    Mail,
    Calendar,
    Phone,
    Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoutes';
import { ADMIN_USERS_API } from '@/app/api/endpoints/rest-api/dashboard/users';

function AdminUsersPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [navigating, setNavigating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTier, setSelectedTier] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, selectedTier, selectedStatus]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await ADMIN_USERS_API.GET_ALL_USERS({
                page: currentPage,
                limit: 20,
                subscriptionTier: selectedTier,
                emailVerified: selectedStatus,
                search: searchTerm
            });

            if (!response.error && response.data) {
                setUsers(response.data.users || []);
                setTotalPages(response.data.totalPages || 1);
                setTotalUsers(response.data.total || 0);
            } else {
                toast.error(response.message || 'Failed to load users');
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchUsers();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchUsers();
    };

    const handleUserClick = (userId: number) => {
        setNavigating(true);
        router.push(`/admin/users/${userId}`);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';

            return date.toLocaleDateString('en-ZA', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'N/A';
        }
    };

    const getSubscriptionTierColor = (tier: string) => {
        if (!tier || tier === 'free') return 'bg-gray-100 text-gray-800';
        if (tier.includes('platinum')) return 'bg-purple-100 text-purple-800';
        if (tier.includes('gold')) return 'bg-yellow-100 text-yellow-800';
        if (tier.includes('silver')) return 'bg-gray-100 text-gray-800';
        return 'bg-blue-100 text-blue-800';
    };

    const getSubscriptionTierLabel = (tier: string) => {
        if (!tier || tier === 'free') return 'Free';
        return tier.replace(/_/g, ' ');
    };

    const subscriptionTiers = [
        { value: '', label: 'All Tiers' },
        { value: 'free', label: 'Free' },
        { value: 'individual_silver', label: 'Individual Silver' },
        { value: 'individual_gold', label: 'Individual Gold' },
        { value: 'individual_platinum', label: 'Individual Platinum' },
        { value: 'organizational_silver', label: 'Organizational Silver' },
        { value: 'organizational_gold', label: 'Organizational Gold' },
        { value: 'organizational_platinum', label: 'Organizational Platinum' },
    ];

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'true', label: 'Verified' },
        { value: 'false', label: 'Pending' },
    ];

    if (navigating) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading user details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => router.push('/admin/dashboard')}
                                className="mr-4 text-gray-500 hover:text-gray-700"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h1>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                    Total Users: {totalUsers}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline text-sm font-medium">Refresh</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Users
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by name or email..."
                                        className="pl-10 w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subscription
                                </label>
                                <select
                                    value={selectedTier}
                                    onChange={(e) => setSelectedTier(e.target.value)}
                                    className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent"
                                >
                                    {subscriptionTiers.map(tier => (
                                        <option key={tier.value} value={tier.value}>
                                            {tier.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent"
                                >
                                    {statusOptions.map(status => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-2 bg-[#01311B] text-white rounded-lg hover:bg-[#9FC93B] transition-colors text-sm sm:text-base"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9FC93B]"></div>
                        </div>
                    ) : (
                        <>

                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.length > 0 ? (
                                            users.map((user: any) => (
                                                <tr
                                                    key={user.id}
                                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                                    onClick={() => handleUserClick(user.id)}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                                            {user.membershipNumber && (
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    ID: {user.membershipNumber}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                                                                <span className="truncate">{user.email}</span>
                                                            </div>
                                                            {user.cellphone && (
                                                                <div className="flex items-center text-xs text-gray-400">
                                                                    <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
                                                                    <span>{user.cellphone}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSubscriptionTierColor(user.subscriptionTier)}`}>
                                                            {getSubscriptionTierLabel(user.subscriptionTier)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
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
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                                                            <span>{formatDate(user.registrationDate)}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                    No users found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="block md:hidden divide-y divide-gray-200">
                                {users.length > 0 ? (
                                    users.map((user: any) => (
                                        <div
                                            key={user.id}
                                            onClick={() => handleUserClick(user.id)}
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
                                                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                                                    <span className="truncate">{user.email}</span>
                                                </div>

                                                {user.cellphone && (
                                                    <div className="flex items-center text-gray-600">
                                                        <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                                                        <span>{user.cellphone}</span>
                                                    </div>
                                                )}

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
                                                        {formatDate(user.registrationDate)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        No users found
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {!loading && users.length > 0 && (
                        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-500 order-2 sm:order-1">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex space-x-2 order-1 sm:order-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AdminUsers() {
    return (
        <AdminProtectedRoute>
            <AdminUsersPage />
        </AdminProtectedRoute>
    );
}
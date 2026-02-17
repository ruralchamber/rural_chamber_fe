/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ChevronLeft,
  CreditCard,
  UserCheck,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoutes';
import { ADMIN_USERS_API } from '@/app/api/endpoints/rest-api/dashboard/users';

function AdminUserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await ADMIN_USERS_API.GET_USER_DETAILS(parseInt(userId));
      
      if (!response.error && response.data) {
        console.log('📋 User data received:', response.data);
        setUserData(response.data);
      } else {
        toast.error(response.message || 'Failed to load user details');
      }
    } catch (error: any) {
      console.error('Failed to fetch user details:', error);
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserDetails();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      return date.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', dateString, error);
      return 'N/A';
    }
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return 'R 0';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSubscriptionTierColor = (tier: string) => {
    if (!tier || tier === 'free') return 'bg-gray-100 text-gray-800';
    if (tier.includes('platinum')) return 'bg-purple-100 text-purple-800';
    if (tier.includes('gold')) return 'bg-yellow-100 text-yellow-800';
    if (tier.includes('silver')) return 'bg-gray-100 text-gray-800';
    return 'bg-blue-100 text-blue-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">User not found</p>
          <button
            onClick={() => router.push('/admin/users')}
            className="mt-4 px-4 py-2 bg-[#01311B] text-white rounded-lg hover:bg-[#9FC93B] transition-colors"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const registration = userData.registration || {};
  const subscription = userData.subscription || {};
  const memberSinceDate = userData.registrationDate || userData.createdAt;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/users')}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{userData.fullName}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Member since {formatDate(memberSinceDate)}
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Email Verification</p>
                <div className="flex items-center mt-2">
                  {userData.emailVerified ? (
                    <>
                      <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-green-600 font-medium">Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="text-yellow-600 font-medium">Pending</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Registration</p>
                <div className="flex items-center mt-2">
                  {userData.registrationCompleted ? (
                    <>
                      <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-green-600 font-medium">Completed</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="text-yellow-600 font-medium">Incomplete</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Subscription Status</p>
                <div className="flex items-center mt-2">
                  {subscription.status === 'active' ? (
                    <>
                      <CreditCard className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-green-600 font-medium capitalize">{subscription.status}</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="text-yellow-600 font-medium capitalize">{subscription.status || 'No Subscription'}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="text-lg font-semibold text-gray-900 mt-2 capitalize">
                  {userData.accountType || registration.accountType || 'Individual'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{userData.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{userData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cellphone</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{userData.cellphone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID/Passport</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{registration.idNumber || registration.passport || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{formatDate(registration.dateOfBirth)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{registration.gender || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h2>
              <div className="space-y-3">
                <p className="text-sm text-gray-900">
                  {registration.addressLine1}
                  {registration.addressLine2 && `, ${registration.addressLine2}`}
                  {registration.addressLine3 && `, ${registration.addressLine3}`}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Suburb/City</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{registration.suburb || registration.city || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Province</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{registration.province || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{registration.country || 'South Africa'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Postal Code</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{registration.postalCode || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {(userData.accountType === 'organizational' || registration.accountType === 'organizational') && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Company Name</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{registration.companyName || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Registration Number</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{registration.registrationNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sector</p>
                    <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{registration.sector || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">VAT Number</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{registration.vatNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className={`mt-1 inline-block px-3 py-1 text-sm font-medium rounded-full ${getSubscriptionTierColor(subscription.subscriptionType || userData.subscriptionTier)}`}>
                    {(subscription.subscriptionType || userData.subscriptionTier || 'Free').replace(/_/g, ' ')}
                  </p>
                </div>

                {subscription.id && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {formatCurrency(subscription.amount)}
                        <span className="text-sm font-normal text-gray-500 ml-1">
                          / {subscription.billingFrequency}
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatDate(subscription.startDate)}
                      </p>
                    </div>

                    {subscription.nextBillingDate && (
                      <div>
                        <p className="text-sm text-gray-500">Next Payment</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {formatDate(subscription.nextBillingDate)}
                        </p>
                        {(() => {
                          const days = Math.ceil((new Date(subscription.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                          return (
                            <p className={`text-xs mt-1 ${
                              days < 0 ? 'text-red-600' : 
                              days <= 7 ? 'text-orange-600' : 
                              'text-green-600'
                            }`}>
                              {days < 0 ? `${Math.abs(days)} days overdue` : `${days} days remaining`}
                            </p>
                          );
                        })()}
                      </div>
                    )}

                    {subscription.paymentMethod && (
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="text-sm font-medium text-gray-900 mt-1 capitalize">
                          {subscription.cardBrand} •••• {subscription.cardLastFour}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Membership Information</h2>
              <div className="space-y-4">
                {userData.membershipNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Membership Number</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{userData.membershipNumber}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500">Billing Frequency</p>
                  <p className="text-sm font-medium text-gray-900 mt-1 capitalize">
                    {registration.billingFrequency || 'Annual'}
                  </p>
                </div>

                {userData.subscriptionAmount > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Membership Amount</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatCurrency(userData.subscriptionAmount)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminUserDetails() {
  return (
    <AdminProtectedRoute>
      <AdminUserDetailsPage />
    </AdminProtectedRoute>
  );
}
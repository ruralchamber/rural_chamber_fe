"use client"

import React, { useState, useEffect } from 'react';
import { X, Check, CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SUBSCRIPTION_API } from '@/app/api/endpoints/rest-api/subscription/subscription';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default function SubscriptionSettings() {
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState('');
  const [authError, setAuthError] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    checkAuthAndLoadSubscription();
  }, []);

  const checkAuthAndLoadSubscription = async () => {
    let token = null;
    
    const tokenCookie = cookies.get('token');
    if (tokenCookie?.accessToken) {
      token = tokenCookie.accessToken;
    } else if (tokenCookie) {
      token = tokenCookie;
    }
    
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken') || 
              localStorage.getItem('access_token') ||
              localStorage.getItem('token');
    }
    
    if (!token) {
      setAuthError(true);
      setIsLoading(false);
      return;
    }

    await loadSubscription();
  };

  const loadSubscription = async () => {
    try {
      setIsLoading(true);
      
      const response = await SUBSCRIPTION_API.GET_SUBSCRIPTION();
      
      if (response.error) {
        if (response.message?.includes('401') || 
            response.message?.includes('Unauthorized') ||
            response.message?.includes('Authentication required') ||
            response.status === 401) {
          setAuthError(true);
          toast.error('Session expired. Please login again.');
        } else if (response.message?.includes('404') || 
                   response.message?.includes('not found') ||
                   response.message?.includes('No active subscription')) {
          setSubscription(null);
        } else {
          toast.error(response.message || 'Failed to load subscription');
        }
      } else if (response.data) {
        setSubscription(response.data);
      } else {
        setSubscription(null);
      }
    } catch (error: any) {
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        setAuthError(true);
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const getSubscriptionTypeName = (type: string) => {
    return type.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = async () => {
    try {
      setIsCancelling(true);
      
      const response = await SUBSCRIPTION_API.CANCEL_SUBSCRIPTION(
        cancelReason ? { reason: cancelReason } : undefined
      );
      
      if (response.error) {
        toast.error(response.message || 'Failed to cancel subscription');
      } else {
        setShowCancelDialog(false);
        setShowSuccessDialog(true);
        setSubscription(response.data);
        toast.success('Subscription cancelled successfully');
      }
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      toast.error(error.message || 'Failed to cancel subscription');
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePauseSubscription = async () => {
    try {
      const response = await SUBSCRIPTION_API.PAUSE_SUBSCRIPTION();
      
      if (response.error) {
        toast.error(response.message || 'Failed to pause subscription');
      } else {
        setSubscription(response.data);
        toast.success('Subscription paused successfully');
      }
    } catch (error: any) {
      console.error('Error pausing subscription:', error);
      toast.error(error.message || 'Failed to pause subscription');
    }
  };

  const handleResumeSubscription = async () => {
    try {
      const response = await SUBSCRIPTION_API.RESUME_SUBSCRIPTION();
      
      if (response.error) {
        toast.error(response.message || 'Failed to resume subscription');
      } else {
        setSubscription(response.data);
        toast.success('Subscription resumed successfully');
      }
    } catch (error: any) {
      console.error('Error resuming subscription:', error);
      toast.error(error.message || 'Failed to resume subscription');
    }
  };

  const handleChangePlan = async () => {
    try {
      setIsChangingPlan(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      
      if (!userInfo) {
        toast.error('Please login to change your subscription');
        router.push('/auth/login');
        return;
      }

      router.push('/membership');
    } catch (error) {
      console.error('Error changing plan:', error);
      toast.error('Failed to change subscription plan');
    } finally {
      setIsChangingPlan(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
  };

  const handleLoginRedirect = () => {
    sessionStorage.setItem('redirectAfterLogin', '/subscription/profile');
    router.push('/auth/login');
  };

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                Login Required
              </h3>
              <p className="text-gray-600 mb-6">
                You need to be logged in to view your subscription settings.
              </p>
              <button
                onClick={handleLoginRedirect}
                className="bg-[#9FC93B] hover:bg-[#8AB82F] text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-10">
            Subscription Settings
          </h1>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading subscription details...</p>
            </div>
          ) : subscription ? (
            <>
              <div className="border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-600 mb-3">
                      Subscription plan
                    </h2>
                    <p className="text-gray-400 text-sm mb-1">
                      {formatAmount(subscription.amount)} / {subscription.billingFrequency === 'monthly' ? 'Monthly' : 'Annual'}
                    </p>
                    <p className="text-gray-700 text-base">
                      {getSubscriptionTypeName(subscription.subscriptionType)} Plan
                    </p>
                    {subscription.nextBillingDate && subscription.status === 'active' && (
                      <p className="text-sm text-gray-500 mt-1">
                        Next billing date - {formatDate(subscription.nextBillingDate)}
                      </p>
                    )}
                    {subscription.status === 'paused' && subscription.resumesAt && (
                      <p className="text-sm text-amber-600 mt-1">
                        Paused until {formatDate(subscription.resumesAt)}
                      </p>
                    )}
                    {subscription.status === 'cancelled' && (
                      <p className="text-sm text-red-600 mt-1">
                        Cancelled on {formatDate(subscription.cancelledAt)}
                      </p>
                    )}
                  </div>
                  {subscription.status === 'active' && (
                    <button 
                      onClick={handleChangePlan}
                      disabled={isChangingPlan}
                      className="bg-[#9FC93B] hover:bg-[#a8c944] text-white px-8 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isChangingPlan ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Change Subscription Plan'
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-gray-500 text-sm font-medium mb-4">
                  Payment method via Paystack
                </h3>
                <div className="bg-linear-to-br from-[#9FC93B] to-[#89B534] rounded-2xl p-8 text-white shadow-md max-w-2xl">
                  <div className="mb-6">
                    <p className="text-2xl font-semibold">
                      Paystack Payment Gateway
                    </p>
                  </div>
                  <p className="text-lg mb-2">
                    Secure payments powered by Paystack
                  </p>
                  <p className="text-sm opacity-90">
                    Your payment information is securely managed by Paystack
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                {subscription.status === 'active' && (
                  <button 
                    onClick={handlePauseSubscription}
                    className="border-2 border-gray-300 text-gray-600 hover:border-[#9FC93B] hover:text-[#9FC93B] px-6 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Pause Subscription
                  </button>
                )}
                
                {subscription.status === 'paused' && (
                  <button 
                    onClick={handleResumeSubscription}
                    className="border-2 border-[#9FC93B] text-[#9FC93B] hover:bg-[#9FC93B] hover:text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Resume Subscription
                  </button>
                )}

                {subscription.status === 'active' && (
                  <button
                    onClick={handleCancelClick}
                    className="text-[#9FC93B] hover:text-[#8AB82F] font-medium transition-colors"
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No Active Subscription
              </h3>
              <p className="text-gray-600 mb-6">
                You don't have an active subscription yet.
              </p>
              <button
                onClick={() => router.push('/membership')}
                className="bg-[#9FC93B] hover:bg-[#8AB82F] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Browse Membership Plans
              </button>
            </div>
          )}
        </div>
      </div>

      {showCancelDialog && (
        <div className="fixed inset-0 backdrop-blur-xm bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-10 max-w-md w-full shadow-2xl">
            <h3 className="text-center text-gray-800 text-xl font-bold mb-4">
              Cancel Subscription
            </h3>
            <p className="text-center text-gray-700 text-base leading-relaxed mb-4">
              Are you sure you want to cancel your subscription?<br />
              You will lose access to premium features.
            </p>
            <div className="mb-6">
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm"
                rows={3}
              />
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowCancelDialog(false)}
                disabled={isCancelling}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                No, Keep It
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Yes, Cancel'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessDialog && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-10 max-w-md w-full shadow-2xl relative">
            <button
              onClick={handleCloseSuccess}
              className="absolute top-4 right-4 text-[#9FC93B] hover:text-[#8AB82F]"
            >
              <X className="h-6 w-6" strokeWidth={2} />
            </button>
            <div className="flex flex-col items-center pt-4">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <Check className="h-12 w-12 text-white" strokeWidth={3} />
              </div>
              <h3 className="text-center text-gray-800 text-2xl font-bold mb-2">
                Cancelled!
              </h3>
              <p className="text-center text-gray-600 text-base">
                Your subscription has been cancelled.
              </p>
              <button
                onClick={handleCloseSuccess}
                className="mt-6 bg-[#9FC93B] hover:bg-[#8AB82F] text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
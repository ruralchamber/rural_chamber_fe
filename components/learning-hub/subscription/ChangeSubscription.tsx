// app/components/learning-hub/subscription/ChangeSubscription.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, AlertCircle, ArrowRight, PauseCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SUBSCRIPTION_API, SubscriptionType } from '@/app/api/endpoints/rest-api/subscription/subscription';
import Cookies from 'universal-cookie';
import Image from 'next/image';
import { motion } from 'framer-motion';

const cookies = new Cookies();

export default function ChangeSubscription() {
  const router = useRouter();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionType | ''>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isChanging, setIsChanging] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

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
      
      console.log('📥 Subscription response:', response);
      console.log('📊 Current subscription data:', response.data);
      
      if (response.error) {
        if (response.message?.includes('401') || 
            response.message?.includes('Unauthorized') ||
            response.status === 401) {
          setAuthError(true);
          toast.error('Session expired. Please login again.');
        } else {
          toast.error(response.message || 'Failed to load subscription');
        }
      } else if (response.data) {
        setCurrentSubscription(response.data);
        
        if (response.data.billingFrequency) {
          setBillingCycle(response.data.billingFrequency);
        }
      }
    } catch (error: any) {
      console.error('Error loading subscription:', error);
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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const getSubscriptionTypeName = (type: string) => {
    if (!type) return 'Free Membership';
    
    return type.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const pricingTiers = [
    {
      id: "free" as SubscriptionType,
      name: "Free Membership",
      monthlyPrice: 0,
      annualPrice: 0,
      subtitle: "Access to Industry-Specific Content",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      features: ["Limited Networking Opportunities"],
      buttonText: "Join for Free",
      buttonStyle: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
    },
    {
      id: "individual_silver" as SubscriptionType,
      name: "Individual Silver",
      monthlyPrice: 46,
      annualPrice: 500,
      subtitle: "Perfect for entrepreneurs and small business owners",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      features: [
        "Networking Sessions/Stream",
        "Access to Monthly Events",
        "Business Planning & Advisory",
        "Business Finance Support Assistance",
        "Association Affiliation",
      ],
      buttonText: "Select Plan",
      buttonStyle: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
    },
    {
      id: "individual_gold" as SubscriptionType,
      name: "Individual Gold",
      monthlyPrice: 115,
      annualPrice: 1250,
      subtitle: "Enhanced benefits for growing businesses",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      features: [
        "All Silver features and more",
        "Ohakaza Membership benefits:",
        "Goats farming study guides,",
        "Access to online practicals, member card",
        "Enhanced networking opportunities with tangible actions and results",
      ],
      buttonText: "Select Plan",
      buttonStyle: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
    },
    {
      id: "individual_platinum" as SubscriptionType,
      name: "Individual Platinum",
      monthlyPrice: 230,
      annualPrice: 2500,
      subtitle: "Comprehensive support for established businesses",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      features: [
        "Silver, Gold packages and more",
        "Access to exclusive events, conferences,",
        "Travels to meet and expand business in other countries",
        "Co-travel opportunities with the team to meet global investors, partners and other stakeholders",
      ],
      buttonText: "Select Plan",
      buttonStyle: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
    },
    {
      id: "organizational_silver" as SubscriptionType,
      name: "Organizational Silver",
      monthlyPrice: 230,
      annualPrice: 2500,
      subtitle: "Great for small organizations and non-profits",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      features: [
        "Networking Sessions/Stream",
        "Access to Monthly Events",
        "Business Planning & Advisory",
        "Business Finance Support Assistance",
        "Association Affiliation",
      ],
      buttonText: "Select Plan",
      buttonStyle: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
    },
    {
      id: "organizational_gold" as SubscriptionType,
      name: "Organizational Gold",
      monthlyPrice: 350,
      annualPrice: 3500,
      subtitle: "Enhanced organizational benefits",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      features: [
        "All Silver features and more",
        "Ohakaza Membership benefits:",
        "Goats farming study guides,",
        "access to online practicals, member card",
        "Enhanced networking opportunities with tangible actions and results",
      ],
      buttonText: "Select Plan",
      buttonStyle: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
    },
    {
      id: "organizational_platinum" as SubscriptionType,
      name: "Organizational Platinum",
      monthlyPrice: 460,
      annualPrice: 5000,
      subtitle: "Comprehensive support for established businesses",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      features: [
        "Silver, Gold packages and more",
        "Access to exclusive events, conferences,",
        "Travels to meet and expand business in other countries",
        "Co-travel opportunities with the team to meet global investors, partners and other stakeholders",
      ],
      buttonText: "Contact Us",
      buttonStyle: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
    },
  ];

  const handlePlanSelect = (planId: SubscriptionType) => {
 
    if (planId === "free") {
      toast.info('Free membership is automatically included');
      return;
    }
    
    setSelectedPlan(planId);
  };

  const handleChangeSubscription = async () => {
    if (!selectedPlan) {
      toast.error('Please select a new plan');
      return;
    }

    if (currentSubscription?.subscriptionType === selectedPlan) {
      toast.info(`You are already on the ${getSubscriptionTypeName(selectedPlan)} plan`);
      return;
    }

    if (currentSubscription?.status === 'paused') {
      toast.error('Your subscription is currently paused. Please resume it before changing plans.');
      return;
    }

    try {
      setIsChanging(true);
      
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const registrationId = userInfo.registrationId || userInfo.id;

      if (!registrationId) {
        toast.error('User registration information not found');
        router.push('/auth/login');
        return;
      }

      const selectedTier = pricingTiers.find(tier => tier.id === selectedPlan);
      if (!selectedTier) {
        toast.error('Selected plan not found');
        return;
      }

      if (selectedTier.buttonText === "Contact Us") {
        router.push('/contact-us');
        return;
      }

      const amount = billingCycle === "monthly" ? selectedTier.monthlyPrice : selectedTier.annualPrice;

      const subscriptionData = {
        subscriptionType: selectedPlan,
        billingFrequency: billingCycle,
        amount,
        registrationId,
        planName: selectedTier.name,
      };

      sessionStorage.setItem('pendingSubscription', JSON.stringify({
        ...subscriptionData,
        isChangeSubscription: true, 
        currentSubscriptionType: currentSubscription?.subscriptionType
      }));
      
      router.push(`/payment?plan=${selectedPlan}&billing=${billingCycle}&change=true`);
      
    } catch (error: any) {
      console.error('Error changing subscription:', error);
      toast.error(error.message || 'Failed to change subscription');
    } finally {
      setIsChanging(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    router.push('/subscription/profile');
  };

  const handleLoginRedirect = () => {
    sessionStorage.setItem('redirectAfterLogin', '/subscription/change-plan');
    router.push('/auth/login');
  };

  
  const getPlansToShow = () => {
    console.log('🔄 Current subscription type:', currentSubscription?.subscriptionType);
    
  
    if (!currentSubscription?.subscriptionType) {
      console.log('📋 No current subscription, showing all paid plans');
      return pricingTiers.filter(tier => tier.id !== "free");
    }
    
    
    const isOrganizational = currentSubscription?.subscriptionType?.includes('organizational');
    console.log('🏢 Is organizational?', isOrganizational);
    
    
    const filtered = pricingTiers.filter(tier => {
     
      if (tier.id === "free") return false;
      
      
      if (isOrganizational) {
        return tier.id.includes('organizational');
      }
      
      
      return tier.id.includes('individual');
    });
    
    console.log('📋 Filtered plans:', filtered.map(p => p.name));
    return filtered;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
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
                You need to be logged in to change your subscription plan.
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

  const plansToShow = getPlansToShow();

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="bg-white rounded-2xl p-8 md:p-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#01311B] mb-10">
            Change Your Subscription Plan
          </h1>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading subscription details...</p>
            </div>
          ) : (
            <>
            
              {currentSubscription && (
                <div className="mb-10">
                  <h2 className="text-lg font-semibold text-gray-600 mb-3">
                    Current Plan
                  </h2>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-700">
                          {getSubscriptionTypeName(currentSubscription.subscriptionType)} Plan
                        </p>
                        <p className="text-gray-600 mt-2">
                          {formatAmount(currentSubscription.amount)} / {currentSubscription.billingFrequency === 'monthly' ? 'month' : 'year'}
                        </p>
                        {currentSubscription.status && (
                          <div className="mt-2">
                            {currentSubscription.status === 'active' ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                <Check className="w-4 h-4 mr-1" />
                                Active
                              </span>
                            ) : currentSubscription.status === 'paused' ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                <PauseCircle className="w-4 h-4 mr-1" />
                                Paused
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                {currentSubscription.status}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}


              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-600 mb-4">
                  Select Billing Cycle
                </h2>
                <div className="flex gap-2 max-w-xs">
                  <button
                    onClick={() => setBillingCycle("annual")}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      billingCycle === "annual"
                        ? "bg-[#9FC93B] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Annual
                  </button>
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      billingCycle === "monthly"
                        ? "bg-[#9FC93B] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Monthly
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Choose how you'd like to be billed for your new plan
                </p>
              </div>


              <div className="mb-10">
                <h2 className="text-lg font-semibold text-gray-600 mb-6">
                  Select New Plan
                </h2>
                
                {plansToShow.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">
                      No Plans Available
                    </h3>
                    <p className="text-gray-600 mb-6">
                      No subscription plans are available for your account type.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {plansToShow.map((tier) => {
                      const price = billingCycle === "monthly" ? tier.monthlyPrice : tier.annualPrice;
                      const isCurrentPlan = currentSubscription?.subscriptionType === tier.id;
                      
                      return (
                        <motion.div
                          key={tier.id}
                          variants={cardVariants}
                          whileHover={{
                            y: -8,
                            transition: { duration: 0.3 },
                          }}
                          className="relative"
                        >
                          <div className={`bg-white border-2 ${selectedPlan === tier.id ? 'border-[#9FC93B] bg-[#F5F9E8]' : isCurrentPlan ? 'border-[#9FC93B]' : 'border-gray-200'} rounded-lg p-6 h-full flex flex-col hover:shadow-xl transition-shadow duration-300`}>
                            
                            {selectedPlan === tier.id && !isCurrentPlan && (
                              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                Selected
                              </div>
                            )}
                            
                            <div className="mb-6">
                              <div className="flex items-baseline mb-2">
                                <span className="text-4xl font-bold text-gray-900">
                                  {`R${price}`}
                                </span>
                                <span className="text-base text-gray-500 ml-2">
                                  /{billingCycle === "monthly" ? "Month" : "Year"}
                                </span>
                              </div>
                              <div className={`text-lg font-semibold mb-2 ${tier.color}`}>
                                {tier.name}
                                {isCurrentPlan && (
                                  <span className="ml-2 text-sm bg-[#9FC93B] text-white px-2 py-0.5 rounded">
                                    Current
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{tier.subtitle}</p>

                              <div className="h-1 relative top-2 mx-auto">
                                <Image
                                  src="/Divider.png"
                                  alt="Divider"
                                  width={120}
                                  height={2}
                                  className="object-contain"
                                />
                              </div>
                            </div>

                            <ul className="space-y-4 mb-8 grow">
                              {tier.features.map((feature, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start text-sm text-gray-700"
                                >
                                  <span className={`${tier.color} mr-3 mt-0.5 shrink-0`}>
                                    <Check className="w-5 h-5" />
                                  </span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="mt-auto">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handlePlanSelect(tier.id)}
                                disabled={isCurrentPlan || currentSubscription?.status === 'paused'}
                                className={`w-full px-6 py-3 rounded-md text-base font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                                  isCurrentPlan 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : selectedPlan === tier.id
                                    ? 'bg-[#9FC93B] text-white hover:bg-[#8AB82F]'
                                    : tier.buttonStyle
                                } ${currentSubscription?.status === 'paused' ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {isCurrentPlan ? 'Current Plan' : 
                                tier.buttonText === "Contact Us" ? "Contact Us" :
                                selectedPlan === tier.id ? 'Selected' : 'Select Plan'}
                                {!isCurrentPlan && selectedPlan !== tier.id && tier.buttonText !== "Contact Us" && (
                                  <ArrowRight className="w-4 h-4" />
                                )}
                              </motion.button>
                              {currentSubscription?.status === 'paused' && isCurrentPlan && (
                                <p className="text-xs text-red-600 mt-2 text-center">
                                  Subscription is paused. Resume to change plans.
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>


              {plansToShow.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    onClick={() => router.push('/subscription/settings')}
                    className="border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangeSubscription}
                    disabled={!selectedPlan || isChanging || selectedPlan === "free" || currentSubscription?.status === 'paused'}
                    className="bg-[#9FC93B] hover:bg-[#8AB82F] text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isChanging ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Continue to Payment
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {currentSubscription?.status === 'paused' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <PauseCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-800 font-medium">
                      Your subscription is currently paused. Please resume it from the Subscription Settings page before changing plans.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/subscription/profile')}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Go to Subscription Settings →
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {showSuccessDialog && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
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
                Plan Changed!
              </h3>
              <p className="text-center text-gray-600 text-base mb-4">
                Your subscription has been successfully updated.
              </p>
              {selectedPlan && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 w-full">
                  <p className="text-center text-green-800 font-medium">
                    New Plan: {pricingTiers.find(p => p.id === selectedPlan)?.name}
                  </p>
                </div>
              )}
              <button
                onClick={handleCloseSuccess}
                className="bg-[#9FC93B] hover:bg-[#8AB82F] text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Go to Subscription Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SUBSCRIPTION_API, SubscriptionType } from "@/app/api/endpoints/rest-api/subscription/subscription";

interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyAmount: number;
  annualAmount: number;
  features: string[];
  accountType: string;
  membershipType: SubscriptionType;
  isActive: boolean;
}

export default function MembershipPricing() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [plans, setPlans] = useState<PricingTier[]>([]);
  const [userAccountType, setUserAccountType] = useState<"individual" | "organizational">("individual");
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  useEffect(() => {
    loadUserInfo();
    checkCurrentSubscription();
    fetchPlans();
    
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    
    if (reference) {
      handlePaymentSuccess(reference);
    }
  }, []);

  const loadUserInfo = () => {
    try {
      const userData = localStorage.getItem('userInfo');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const accountType = parsedUser.accountType || "individual";
        setUserAccountType(accountType);
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const checkCurrentSubscription = async () => {
    try {
      setIsCheckingSubscription(true);
      
      const token = localStorage.getItem('accessToken') || 
                    localStorage.getItem('access_token') ||
                    localStorage.getItem('token');
      
      if (!token) {
        return;
      }

      const response = await SUBSCRIPTION_API.GET_SUBSCRIPTION();
      
      if (response.data && !response.error) {
        setCurrentSubscription(response.data);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setIsCheckingSubscription(false);
    }
  };

  const fetchPlans = async () => {
    try {
      setIsLoadingPlans(true);
      const response = await SUBSCRIPTION_API.GET_SUBSCRIPTION_PLANS();
      
      let fetchedPlans: PricingTier[] = [];
      
      if (response.data) {
        const apiData = response.data;
        
        if (userAccountType === "individual" && apiData.individual) {
          fetchedPlans = apiData.individual.map((plan: any) => ({
            id: plan.id,
            name: plan.name,
            description: plan.description,
            monthlyAmount: plan.monthlyAmount,
            annualAmount: plan.annualAmount,
            features: plan.features || [],
            accountType: plan.accountType,
            membershipType: plan.membershipType,
            isActive: plan.isActive
          }));
        } else if (userAccountType === "organizational" && apiData.organizational) {
          fetchedPlans = apiData.organizational.map((plan: any) => ({
            id: plan.id,
            name: plan.name,
            description: plan.description,
            monthlyAmount: plan.monthlyAmount,
            annualAmount: plan.annualAmount,
            features: plan.features || [],
            accountType: plan.accountType,
            membershipType: plan.membershipType,
            isActive: plan.isActive
          }));
        }
      }
      
      const freePlan: PricingTier = {
        id: "free",
        name: "Free Membership",
        description: "Access to Industry-Specific Content",
        monthlyAmount: 0,
        annualAmount: 0,
        features: ["Limited Networking Opportunities"],
        accountType: userAccountType,
        membershipType: "free" as SubscriptionType,
        isActive: true
      };
      
      setPlans([freePlan, ...fetchedPlans]);
    } catch (error: any) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load membership plans');
    } finally {
      setIsLoadingPlans(false);
    }
  };

const handleSelectPlan = async (plan: PricingTier) => {
  const token = localStorage.getItem('accessToken') || 
                localStorage.getItem('access_token') ||
                localStorage.getItem('token');
  
  if (!token) {
    toast.error('Please login to subscribe');
    sessionStorage.setItem('redirectAfterLogin', '/membership');
    router.push('/auth/login');
    return;
  }

  setIsLoading(true);

  try {
    const amount = billingCycle === "monthly" ? plan.monthlyAmount : plan.annualAmount;
    const isFreePlan = plan.membershipType === "free";
    
    const hasActiveSubscription = currentSubscription && 
                                 (currentSubscription.status === 'active' || 
                                  currentSubscription.status === 'paused');

    if (!hasActiveSubscription && !currentSubscription) {
      if (isFreePlan) {
        const updateResponse = await SUBSCRIPTION_API.UPDATE_SUBSCRIPTION_PLAN({
          newSubscriptionType: "free",
          newBillingFrequency: "annual"
        });
        
        if (!updateResponse.error) {
          toast.success(`Successfully subscribed to ${plan.name} plan!`);
          setCurrentSubscription(updateResponse.data);
        } else {
          toast.error('Failed to subscribe to free plan: ' + updateResponse.message);
        }
      } else {
        toast.error('Please complete your registration first before subscribing to a paid plan.');
        router.push('/auth/register');
      }
      return;
    }

    const isCurrentPlan = currentSubscription?.subscriptionType === plan.membershipType;
    if (isCurrentPlan) {
      toast.info(`You're already on the ${plan.name} plan`);
      return;
    }

    const isCurrentPlanFree = currentSubscription?.subscriptionType === "free";
    const isCurrentPlanPaid = currentSubscription?.subscriptionType !== "free" && currentSubscription?.amount > 0;
    
    if (isCurrentPlanFree && !isFreePlan) {
      // Free → Paid: Redirect to payment
      const subscriptionData = {
        subscriptionType: plan.membershipType,
        billingFrequency: billingCycle,
        amount,
        planName: plan.name,
        userId: currentSubscription?.userId,
        registrationId: currentSubscription?.registrationId
      };

      sessionStorage.setItem('pendingSubscription', JSON.stringify(subscriptionData));
      router.push(`/payment?plan=${plan.membershipType}&billing=${billingCycle}&upgrade=true`);
      return;
    }

    if (isCurrentPlanPaid && !isFreePlan) {
      const updateResponse = await SUBSCRIPTION_API.UPDATE_SUBSCRIPTION_PLAN({
        newSubscriptionType: plan.membershipType,
        newBillingFrequency: billingCycle
      });
      
      if (!updateResponse.error) {
        toast.success(`Successfully changed to ${plan.name} plan!`);
        setCurrentSubscription(updateResponse.data);
        
        const oldAmount = currentSubscription?.amount || 0;
        const newAmount = updateResponse.data.amount;
        
        if (newAmount > oldAmount) {
          const difference = newAmount - oldAmount;
          toast.info(`You'll be charged R${difference.toFixed(2)} extra on your next billing cycle.`);
        } else if (newAmount < oldAmount) {
          const difference = oldAmount - newAmount;
          toast.info(`You'll save R${difference.toFixed(2)} on your next billing cycle.`);
        }
      } else {
        toast.error('Failed to change plan: ' + updateResponse.message);
      }
      return;
    }

    if (isCurrentPlanPaid && isFreePlan) {
      const updateResponse = await SUBSCRIPTION_API.UPDATE_SUBSCRIPTION_PLAN({
        newSubscriptionType: "free",
        newBillingFrequency: "annual"
      });
      
      if (!updateResponse.error) {
        toast.success(`Successfully downgraded to ${plan.name} plan!`);
        setCurrentSubscription(updateResponse.data);
        toast.info('A pro-rated refund will be issued for your remaining subscription period.');
      } else {
        toast.error('Failed to change plan: ' + updateResponse.message);
      }
      return;
    }

    toast.error('Invalid subscription change request');
    
  } catch (error: any) {
    console.error('Error selecting plan:', error);
    
    if (error.message?.includes('408') || error.message?.includes('timeout')) {
      toast.error('Request timeout. The server is taking too long to respond. Please try again.');
    } else {
      toast.error(error.message || 'Failed to process subscription');
    }
  } finally {
    setIsLoading(false);
  }
};

  const handlePaymentSuccess = (reference: string) => {
    toast.success('Payment successful! Your subscription has been activated.');
    checkCurrentSubscription();
    
    const url = new URL(window.location.href);
    url.searchParams.delete('reference');
    window.history.replaceState({}, '', url.toString());
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

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  if (isLoadingPlans) {
    return (
      <div className="w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading membership plans...</p>
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No Plans Available
          </h3>
          <p className="text-gray-600 mb-6">
            No membership plans are available for your account type ({userAccountType}).
          </p>
          <button
            onClick={fetchPlans}
            className="bg-[#9FC93B] hover:bg-[#8AB82F] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Retry Loading Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <motion.div
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        
        <motion.div
          className="text-center mb-12 lg:mb-16"
          variants={cardVariants}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#01311B] mb-4">
            Choose Your Membership
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Select the membership plan that best fits your business needs
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {userAccountType === "individual" ? "Individual" : "Organizational"} Plans
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-300 p-1">
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                billingCycle === "annual"
                  ? "bg-[#9FC93B] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Annual Billing
            </button>
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                billingCycle === "monthly"
                  ? "bg-[#9FC93B] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Monthly Billing
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {plans.map((plan) => {
            const price = billingCycle === "monthly" ? plan.monthlyAmount : plan.annualAmount;
            const isCurrentPlan = currentSubscription?.subscriptionType === plan.membershipType;
            const hasActiveSubscription = currentSubscription && currentSubscription.status === 'active';
            const isFreePlan = plan.membershipType === "free";
            
            return (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 },
                }}
                className="relative"
              >
                <div className={`bg-white border-2 ${isCurrentPlan ? 'border-[#9FC93B]' : 'border-gray-200'} rounded-lg p-6 sm:p-8 h-full flex flex-col hover:shadow-xl transition-shadow duration-300`}>
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#9FC93B] text-white px-4 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <div className="flex items-baseline mb-2">
                      <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                        {formatPrice(price)}
                      </span>
                      {!isFreePlan && (
                        <span className="text-base text-gray-500 ml-2">
                          /{billingCycle === "monthly" ? "month" : "year"}
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-semibold mb-2 text-orange-600">
                      {plan.name}
                    </div>
                    <p className="text-sm text-gray-600">{plan.description}</p>

                    {!isFreePlan && (
                      <div className="h-1 relative top-2 mx-auto">
                        <Image
                          src="/Divider.png"
                          alt="Divider"
                          width={120}
                          height={2}
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8 grow">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-sm text-gray-700"
                      >
                        <span className="text-orange-600 mr-3 mt-0.5 shrink-0">
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
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isLoading || isCheckingSubscription || isCurrentPlan}
                      className={`w-full px-6 py-3 rounded-md text-base font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                        isCurrentPlan 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#9FC93B] hover:bg-[#8AB82F] text-white'
                      } ${isLoading || isCheckingSubscription ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isCheckingSubscription ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4" />
                          Checking...
                        </>
                      ) : isLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {isCurrentPlan 
                            ? 'Current Plan' 
                            : hasActiveSubscription
                              ? 'Change to this Plan'
                              : isFreePlan
                                ? 'Get Free Plan'
                                : 'Select Plan'}
                          {!isCurrentPlan && <ArrowRight className="w-4 h-4" />}
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div variants={cardVariants} className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/subscription/profile')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#9FC93B] text-white text-base font-medium rounded-md hover:bg-[#8AB82F] transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Manage Subscription
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
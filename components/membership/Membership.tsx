"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SUBSCRIPTION_API, SubscriptionType } from "@/app/api/endpoints/rest-api/subscription/subscription";

interface PricingTier {
  id: SubscriptionType;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  subtitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
  features: string[];
  buttonText: string;
  buttonStyle: string;
}

export default function MembershipPricing() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);

  useEffect(() => {
    checkCurrentSubscription();
    
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    
    if (reference) {
      handlePaymentSuccess(reference);
    }
  }, []);

  const checkCurrentSubscription = async () => {
    try {
      setIsCheckingSubscription(true);
      
      const token = localStorage.getItem('accessToken') || 
                    localStorage.getItem('access_token') ||
                    localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, user not logged in');
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

  const handlePaymentSuccess = async (reference: string) => {
    setIsLoading(true);
    try {
      toast.success('Payment successful! Activating your subscription...');
      
      const pendingSubscription = sessionStorage.getItem('pendingSubscription');
      if (pendingSubscription) {
        const subscriptionData = JSON.parse(pendingSubscription);
        
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const userId = userInfo.id || userInfo.userId;
        
        if (userId) {
          const subscriptionResponse = await SUBSCRIPTION_API.CREATE_SUBSCRIPTION({
            userId: parseInt(userId),
            registrationId: subscriptionData.registrationId,
            subscriptionType: subscriptionData.subscriptionType,
            billingFrequency: subscriptionData.billingFrequency,
            amount: subscriptionData.amount,
          });
          
          if (subscriptionResponse.error) {
            toast.error('Payment successful but subscription creation failed. Please contact support.');
          } else {
            toast.success('Subscription activated successfully!');
            setCurrentSubscription(subscriptionResponse.data);
            sessionStorage.removeItem('pendingSubscription');
            window.history.replaceState({}, document.title, window.location.pathname);
            
            setTimeout(() => {
              router.push('/subscription/profile');
            }, 2000);
          }
        }
      }
    } catch (error: any) {
      console.error('Payment success processing error:', error);
      toast.error('Failed to process payment. Please contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  const pricingTiers: PricingTier[] = [
    {
      id: "free",
      name: "Free Membership",
      monthlyPrice: 0,
      annualPrice: 0,
      subtitle: "Access to Industry-Specific Content",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      features: ["Limited Networking Opportunities"],
      buttonText: "Join for Free",
      buttonStyle: "border border-gray-300 text-gray-600 hover:border-gray-400",
    },
    {
      id: "individual_silver",
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
      buttonStyle: "border border-gray-300 text-gray-600 hover:border-gray-400",
    },
    {
      id: "individual_gold",
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
      buttonStyle: "border border-gray-300 text-gray-600 hover:border-gray-400",
    },
    {
      id: "individual_platinum",
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
      buttonStyle: "border border-gray-300 text-gray-600 hover:border-gray-400",
    },
    {
      id: "organizational_silver",
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
      buttonStyle: "border border-gray-300 text-gray-600 hover:border-gray-400",
    },
    {
      id: "organizational_gold",
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
      buttonStyle: "border border-gray-300 text-gray-600 hover:border-gray-400",
    },
    {
      id: "organizational_platinum",
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
      buttonStyle: "border border-gray-300 text-gray-600 hover:border-gray-400",
    },
  ];

  const handleSelectPlan = async (tier: PricingTier) => {
    const token = localStorage.getItem('accessToken') || 
                  localStorage.getItem('access_token') ||
                  localStorage.getItem('token');
    
    if (!token) {
      toast.error('Please login to subscribe');
      sessionStorage.setItem('redirectAfterLogin', '/membership');
      router.push('/auth/login');
      return;
    }

    if (tier.id === "free") {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const registrationId = userInfo.registrationId || userInfo.id;

        if (registrationId) {
          const subscriptionResponse = await SUBSCRIPTION_API.CREATE_SUBSCRIPTION({
            userId: userInfo.id,
            registrationId: registrationId,
            subscriptionType: "free",
            billingFrequency: "annual",
            amount: 0,
          });
          
          if (!subscriptionResponse.error) {
            toast.success('Free membership activated!');
            setCurrentSubscription(subscriptionResponse.data);
          }
        }
      } catch (error) {
        toast.info('Free membership is automatically included');
      }
      return;
    }

    if (tier.buttonText === "Contact Us") {
      router.push('/contact-us');
      return;
    }

    if (currentSubscription?.subscriptionType === tier.id) {
      toast.info(`You are already subscribed to the ${tier.name} plan`);
      return;
    }

    setIsLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const registrationId = userInfo.registrationId || userInfo.id;

      if (!registrationId) {
        toast.error('User registration information not found');
        router.push('/auth/login');
        return;
      }

      const amount = billingCycle === "monthly" ? tier.monthlyPrice : tier.annualPrice;

      const subscriptionData = {
        subscriptionType: tier.id,
        billingFrequency: billingCycle,
        amount,
        registrationId,
        planName: tier.name,
      };

      sessionStorage.setItem('pendingSubscription', JSON.stringify(subscriptionData));
      
      router.push(`/payment?plan=${tier.id}&billing=${billingCycle}`);
      
    } catch (error: any) {
      console.error('Error selecting plan:', error);
      toast.error(error.message || 'Failed to process subscription');
    } finally {
      setIsLoading(false);
    }
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
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {pricingTiers.map((tier, index) => {
            const price = billingCycle === "monthly" ? tier.monthlyPrice : tier.annualPrice;
            const isCurrentPlan = currentSubscription?.subscriptionType === tier.id;
            
            return (
              <motion.div
                key={tier.name}
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
                        {tier.id === "organizational_platinum" ? "Custom" : `R${price}`}
                      </span>
                      {tier.id !== "organizational_platinum" && tier.id !== "free" && (
                        <span className="text-base text-gray-500 ml-2">
                          /{billingCycle === "monthly" ? "Month" : "Year"}
                        </span>
                      )}
                    </div>
                    <div className={`text-lg font-semibold mb-2 ${tier.color}`}>
                      {tier.name}
                    </div>
                    <p className="text-sm text-gray-600">{tier.subtitle}</p>

                    {tier.id !== "free" && tier.id !== "organizational_platinum" && (
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

                  {tier.id !== "free" && tier.id !== "organizational_platinum" && (
                    <div className="flex gap-2 mb-6">
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
                  )}

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
                      onClick={() => handleSelectPlan(tier)}
                      disabled={isLoading || isCheckingSubscription || isCurrentPlan}
                      className={`w-full px-6 py-3 rounded-md text-base font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                        isCurrentPlan 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : tier.buttonStyle
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
                          {isCurrentPlan ? 'Current Plan' : tier.buttonText}
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
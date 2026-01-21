"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, Lock, X, Check, Loader2, Gift, Home } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { DONATION_API } from '@/app/api/endpoints/rest-api/donation/donation';

interface User {
  id: string;
  fullName?: string;
  email?: string;
}

export default function DonationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedAmount, setSelectedAmount] = useState<number>(200);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [donationPurpose, setDonationPurpose] = useState<'general' | 'education' | 'community' | 'business' | 'infrastructure' | 'other'>('general');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
  const [notes, setNotes] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const error = searchParams.get('error');
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');

    if (error === 'payment_failed') {
      toast.error('Payment failed. Please try again.');
      router.replace('/donate');
    } else if (error === 'no_reference') {
      toast.error('Payment reference missing. Please try again.');
      router.replace('/donate');
    } else if (error === 'verification_failed') {
      toast.error('Payment verification failed. Please contact support.');
      router.replace('/donate');
    } else if (reference || trxref) {
 
      const paymentRef = reference || trxref;
      console.log('🔄 Redirecting to success page with reference:', paymentRef);
      router.push(`/donate/success?reference=${paymentRef}`);
    }

    checkAuthStatus();
  }, [searchParams, router]);

  const checkAuthStatus = () => {
    try {
      const userData = localStorage.getItem('user_data');
      const token = localStorage.getItem('access_token') || localStorage.getItem('accessToken');
      
      if (userData && token) {
        const user: User = JSON.parse(userData);
        setIsAuthenticated(true);
        setDonorName(user.fullName || '');
        setDonorEmail(user.email || '');
        setCurrentUser(user);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
  };

  const getTotalAmount = (): number => {
    if (customAmount) {
      const amount = parseInt(customAmount) || 0;
      return amount;
    }
    return selectedAmount;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!donorName.trim()) {
      errors.push('Please enter your full name');
    }
    
    if (!donorEmail.trim() || !/\S+@\S+\.\S+/.test(donorEmail)) {
      errors.push('Please enter a valid email address');
    }
    
    const amount = getTotalAmount();
    if (amount <= 0) {
      errors.push('Please select or enter a donation amount');
    } else if (amount < 1) {
      errors.push('Minimum donation amount is R1');
    }
    
    if (isRecurring && !recurrenceFrequency) {
      errors.push('Please select recurrence frequency for recurring donations');
    }
    
    return errors;
  };

  const prepareDonationData = () => {
    const nameParts = donorName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    return {
      email: donorEmail,
      firstName,
      lastName,
      phone: donorPhone || undefined,
      amount: getTotalAmount(),
      donationType: isRecurring ? 'recurring' as const : 'one-time' as const,
      purpose: donationPurpose,
      isRecurring,
      recurrenceFrequency: isRecurring ? recurrenceFrequency : undefined,
      isAnonymous,
      notes: notes || undefined,
      userId: currentUser?.id ? parseInt(currentUser.id) : undefined,
    };
  };

const handleDonateClick = async () => {
  const errors = validateForm();
  if (errors.length > 0) {
    errors.forEach(error => toast.error(error));
    return;
  }

  setIsLoading(true);

  try {
    const donationData = prepareDonationData();
    
    console.log('📝 Creating donation:', donationData);
    
    const result = await DONATION_API.CREATE_AND_PAY(donationData);
    
    console.log('🔍 API Response:', result); 
    
    if (result.error) {
      throw new Error(result.message || 'Failed to process donation');
    }

    if (result.data?.payment?.authorization_url) {
      const authUrl = result.data.payment.authorization_url;
      console.log('✅ Redirecting to Paystack:', authUrl);
      toast.success('Redirecting to payment gateway...');
      
      window.location.replace(authUrl);
    } else {
      console.error('❌ No authorization_url found:', result);
      throw new Error('Payment initialization failed - no redirect URL received');
    }
    
  } catch (error: any) {
    console.error('Error processing donation:', error);
    toast.error(error.message || 'Failed to process donation. Please try again.');
    setIsLoading(false);
  }
};

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelDialog(false);
    
    if (isAuthenticated) {
      router.push('/connect-hub');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="bg-linear-to-r from-[#01311B] to-[#024d2f] text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Gift className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Support Our Mission
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Your generous donation helps us empower rural communities, support small businesses, 
              and create sustainable development opportunities.
            </p>
            
            <div className="mt-8 inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              {isAuthenticated ? (
                <p className="text-sm flex items-center gap-2 justify-center">
                  <Check className="h-4 w-4" />
                  Welcome back! You're donating as {currentUser?.fullName?.split(' ')[0] || 'Member'}
                </p>
              ) : (
                <p className="text-sm">
                  You're donating as a guest. 
                  <button 
                    onClick={() => router.push('/auth/login')}
                    className="ml-2 underline hover:text-gray-300 transition-colors"
                  >
                    Login to track your donations
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
        
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Information</h2>
                <p className="text-gray-500 text-sm">
                  We'll use this information to send your donation receipt and updates.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent transition-all text-sm"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">As it should appear on receipt</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent transition-all text-sm"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Donation receipt will be sent here</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="+27 12 345 6789"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent transition-all text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">For any follow-up questions</p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 text-[#9FC93B] focus:ring-[#9FC93B] border-gray-300 rounded"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700">
                    Make this donation anonymous
                  </label>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Where should your donation go?
                  </label>
                  <select
                    value={donationPurpose}
                    onChange={(e) => setDonationPurpose(e.target.value as typeof donationPurpose)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent transition-all text-sm"
                  >
                    <option value="general">General Fund - Greatest Need</option>
                    <option value="education">Education & Skills Development</option>
                    <option value="community">Community Development Projects</option>
                    <option value="business">Small Business Support</option>
                    <option value="infrastructure">Infrastructure Development</option>
                    <option value="other">Other Specific Purpose</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="h-4 w-4 text-[#9FC93B] focus:ring-[#9FC93B] border-gray-300 rounded"
                    />
                    <label htmlFor="recurring" className="text-sm text-gray-700 font-medium">
                      Make this a recurring donation
                    </label>
                  </div>
                  
                  {isRecurring && (
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Recurrence Frequency
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['monthly', 'quarterly', 'annually'] as const).map((freq) => (
                          <button
                            key={freq}
                            type="button"
                            onClick={() => setRecurrenceFrequency(freq)}
                            className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                              recurrenceFrequency === freq
                                ? 'border-[#9FC93B] bg-[#F5F9E8] text-gray-900'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions, dedication, or message..."
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent transition-all text-sm resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Max 500 characters</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="sticky top-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Amount</h2>
                <p className="text-gray-500 text-sm">
                  Choose a suggested amount or enter your own
                </p>
              </div>

              <div className="mb-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {[1000, 2000, 5000, 10000, 25000, 60000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                        selectedAmount === amount && !customAmount
                          ? 'border-[#9FC93B] bg-[#F5F9E8] text-gray-900 shadow-lg transform scale-105'
                          : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="text-lg font-bold">{formatCurrency(amount)}</div>
                      {amount === 10000 && (
                        <div className="text-xs text-green-600 mt-1 font-medium">Most Popular</div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mb-8">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Or enter a custom amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 font-bold">
                      R
                    </span>
                    <input
                      type="text"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      placeholder="Enter amount in Rands"
                      className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-xl text-lg font-semibold placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Minimum donation: R1</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Your Donation</h3>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(getTotalAmount())}
                  </span>
                </div>
                
                {isRecurring && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">🔁 Recurring Donation:</span> This will be charged {recurrenceFrequency} starting today. You can cancel anytime.
                    </p>
                  </div>
                )}

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                  <Lock className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">100% Secure Payment</span> via Paystack. Your payment information is encrypted and never stored on our servers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleDonateClick}
                  disabled={isLoading}
                  className="w-full bg-[#9FC93B] hover:bg-[#8AB82F] text-white font-bold py-5 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Donate {formatCurrency(getTotalAmount())}
                    </>
                  )}
                </button>

                <button
                  onClick={handleCancelClick}
                  disabled={isLoading}
                  className="w-full py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  {isAuthenticated ? 'Back to Connect Hub' : 'Cancel & Go Home'}
                </button>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Tax-deductible receipt provided</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Your donation is protected by our guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Monthly impact reports sent to donors</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {showCancelDialog && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <X className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Cancel Donation?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this donation? 
                {isAuthenticated 
                  ? " You'll be redirected to your Connect Hub."
                  : " You'll be redirected to the home page."
                }
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                  disabled={isLoading}
                >
                  Continue Donating
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="px-8 py-3 bg-[#9FC93B] hover:bg-[#8AB82F] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Yes, {isAuthenticated ? 'Go to Connect Hub' : 'Go Home'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Donation Makes a Difference
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Every contribution, no matter the size, helps us continue our mission to empower rural communities, 
              support local businesses, and create sustainable development opportunities across South Africa.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span>✓ Secure Payment</span>
              <span>✓ Tax Deductible</span>
              <span>✓ Regular Updates</span>
              <span>✓ 100% Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
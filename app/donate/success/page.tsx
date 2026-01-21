"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Check, 
  Download, 
  Mail, 
  Home, 
  ExternalLink, 
  Clock, 
  Gift,
  Calendar,
  User,
  CreditCard,
  FileText,
  Share2,
  Star,
  Printer
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { DONATION_API } from '@/app/api/endpoints/rest-api/donation/donation';
import jsPDF from 'jspdf';

export default function DonationSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [donation, setDonation] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(35);
  const [autoRedirect, setAutoRedirect] = useState(true); 
  
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const donationId = searchParams.get('donation_id');

  useEffect(() => {
    if (reference) {
      verifyPayment();
    } else if (donationId) {
      fetchDonation();
    } else {
      toast.error('No payment reference found');
      router.push('/donate');
    }
  }, [reference, donationId]);

  useEffect(() => {
    if (!loading && donation && autoRedirect) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
           
            setTimeout(() => {
              handleGoHome();
            }, 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, donation, autoRedirect]);

  const verifyPayment = async () => {
    try {
      setVerifying(true);
      const response = await DONATION_API.VERIFY_PAYMENT(reference!);
      
      if (!response.error && response.data?.status === 'success') {
        setDonation(response.data.donation || response.data);
        toast.success('Payment verified successfully!');
      } else if (response.data?.status === 'pending') {
        toast.info('Payment is still processing. Please wait...');
        
        setTimeout(() => verifyPayment(), 5000);
      } else {
        toast.error('Payment verification failed');
        setTimeout(() => {
          router.push('/donate');
        }, 3000);
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to verify payment');
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  const fetchDonation = async () => {
    try {
      const response = await DONATION_API.GET_DONATION_BY_REFERENCE(donationId!);
      if (!response.error) {
        setDonation(response.data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadReceipt = () => {
    if (!donation) return;
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24);
      pdf.setTextColor(1, 49, 27);
      pdf.text('DONATION RECEIPT', 105, 30, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Community Development Initiative', 105, 40, { align: 'center' });
      pdf.text('Rural Chamber of Commerce', 105, 46, { align: 'center' });
      pdf.text('Johannesburg, South Africa | Tax ID: 123-456-789', 105, 52, { align: 'center' });
      
      pdf.setDrawColor(159, 201, 59);
      pdf.setLineWidth(0.5);
      pdf.line(20, 58, 190, 58);
      
      let yPos = 68;
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(1, 49, 27);
      pdf.text('OFFICIAL RECEIPT FOR TAX PURPOSES', 105, yPos, { align: 'center' });
      yPos += 15;
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Receipt Number: ${donation.receiptNumber || 'N/A'}`, 20, yPos);
      pdf.text(`Date: ${formatDate(donation.paymentDate || donation.createdAt)}`, 120, yPos);
      yPos += 8;
      
      pdf.text(`Transaction ID: ${donation.paymentReference}`, 20, yPos);
      yPos += 15;
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(1, 49, 27);
      pdf.text('DONOR INFORMATION', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Name: ${donation.isAnonymous ? 'Anonymous Donor' : `${donation.donorFirstName} ${donation.donorLastName}`}`, 20, yPos);
      yPos += 7;
      
      pdf.text(`Email: ${donation.donorEmail}`, 20, yPos);
      yPos += 7;
      
      if (donation.donorPhone) {
        pdf.text(`Phone: ${donation.donorPhone}`, 20, yPos);
        yPos += 7;
      }
      
      if (donation.user) {
        pdf.text(`Member ID: ${donation.user.id}`, 20, yPos);
        yPos += 7;
      }
      
      yPos += 5;
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(1, 49, 27);
      pdf.text('DONATION DETAILS', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Amount: ${formatCurrency(donation.amount)}`, 20, yPos);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(formatCurrency(donation.amount), 150, yPos);
      yPos += 10;
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Purpose: ${donation.purpose.charAt(0).toUpperCase() + donation.purpose.slice(1)}`, 20, yPos);
      yPos += 7;
      
      pdf.text(`Type: ${donation.donationType === 'recurring' ? 'Recurring' : 'One-time Donation'}`, 20, yPos);
      yPos += 7;
      
      if (donation.isRecurring) {
        pdf.text(`Frequency: ${donation.recurrenceFrequency}`, 20, yPos);
        yPos += 7;
      }
      
      pdf.text(`Anonymous: ${donation.isAnonymous ? 'Yes' : 'No'}`, 20, yPos);
      yPos += 15;
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(1, 49, 27);
      pdf.text('PAYMENT INFORMATION', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Payment Method: ${donation.paymentGateway || 'Paystack'}`, 20, yPos);
      yPos += 7;
      
      pdf.text(`Status: ${donation.paymentStatus.charAt(0).toUpperCase() + donation.paymentStatus.slice(1)}`, 20, yPos);
      yPos += 7;
      
      pdf.text(`Payment Date: ${formatDate(donation.paymentDate || donation.createdAt)}`, 20, yPos);
      yPos += 15;
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.setTextColor(1, 49, 27);
      pdf.text('TAX DEDUCTION INFORMATION', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('This receipt is your official record for tax purposes.', 20, yPos);
      yPos += 5;
      pdf.text('Organization Tax ID: 123-456-789', 20, yPos);
      yPos += 5;
      pdf.text('Donations are tax deductible under Section 18A of the Income Tax Act.', 20, yPos);
      yPos += 20;
      
      pdf.setFillColor(1, 49, 27);
      pdf.rect(20, yPos, 170, 12, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('THANK YOU FOR YOUR GENEROSITY!', 105, yPos + 8, { align: 'center' });
      
      yPos += 25;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Community Development Initiative | Johannesburg, South Africa', 105, yPos, { align: 'center' });
      yPos += 4;
      pdf.text('Email: info@ruralchamber.co.za | Phone: +27 11 123 4567 | Website: www.ruralchamber.co.za', 105, yPos, { align: 'center' });
      yPos += 4;
      pdf.setFontSize(9);
      pdf.text('This is an official receipt for tax purposes. Please retain for your records.', 105, yPos, { align: 'center' });
      yPos += 4;
      pdf.setFontSize(8);
      pdf.text(`© ${new Date().getFullYear()} Community Development Initiative`, 105, yPos, { align: 'center' });
      
      pdf.save(`donation-receipt-${donation.receiptNumber || donation.paymentReference}.pdf`);
      
      toast.success('Receipt downloaded as PDF!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF receipt');
    }
  };

  const handleSendReceipt = async () => {
    if (!donation?.id) return;
    
    try {
      const response = await DONATION_API.SEND_RECEIPT(donation.id);
      if (!response.error) {
        toast.success('Receipt sent to your email!');
      } else {
        toast.error('Failed to send receipt');
      }
    } catch (error) {
      toast.error('Error sending receipt');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'I just made a donation!',
        text: `I just donated ${formatCurrency(donation.amount)} to support community development. Join me in making a difference!`,
        url: window.location.origin,
      });
    } else {
      const text = `I just donated ${formatCurrency(donation.amount)} to support community development! ${window.location.origin}`;
      navigator.clipboard.writeText(text);
      toast.success('Message copied to clipboard!');
    }
  };

  const handleGoHome = () => {
    if (donation?.user) {
      router.push('/connect-hub');
    } else {
      router.push('/');
    }
  };

  const handleMakeAnotherDonation = () => {
    router.push('/donate');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#9FC93B] border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Verifying your donation...</p>
          <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <Clock className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Donation Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find your donation details. Please check your email for confirmation or contact support.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/donate')}
              className="w-full py-3 px-6 bg-[#9FC93B] hover:bg-[#8AB82F] text-white rounded-lg font-medium transition-colors"
            >
              Make a New Donation
            </button>
            <button
              onClick={handleGoHome}
              className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
    
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-[#01311B] to-[#024d2f]" />
        <div className="relative">
          
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{ y: -100, x: Math.random() * 100 }}
                animate={{ 
                  y: [null, window.innerHeight],
                  x: [null, Math.random() * 100 - 50],
                  rotate: 360
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto mb-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                <Check className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Thank You! 🎉
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                Your generous donation of{' '}
                <span className="font-bold text-yellow-300">
                  {formatCurrency(donation.amount)}
                </span>{' '}
                has been successfully processed and will make a real difference in our community.
              </p>
              
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
              >
                <Star className="h-5 w-5 text-yellow-300" />
                <span className="text-white font-medium">
                  You're now part of our community of changemakers
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            
              <div className="bg-linear-to-r from-[#01311B] to-[#024d2f] p-8 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Donation Confirmation</h2>
                    <p className="text-white/80">Official Receipt #{donation.receiptNumber}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                      {formatDate(donation.paymentDate || donation.createdAt)}
                    </div>
                    <div className="px-4 py-2 bg-green-500 rounded-full text-sm font-medium">
                      ✓ Paid
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">

                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Donor Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {donation.isAnonymous 
                            ? 'Anonymous Donor' 
                            : `${donation.donorFirstName} ${donation.donorLastName}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-900">{donation.donorEmail}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {donation.donorPhone && (
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-gray-900">{donation.donorPhone}</p>
                        </div>
                      )}
                      {donation.user && (
                        <div>
                          <p className="text-sm text-gray-500">Member ID</p>
                          <p className="text-blue-600 font-medium">#{donation.user.id}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Donation Details
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Amount</span>
                          <span className="text-3xl font-bold text-[#01311B]">
                            {formatCurrency(donation.amount)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type</span>
                          <span className="font-medium">
                            {donation.donationType === 'recurring' ? (
                              <span className="inline-flex items-center gap-1">
                                <span>🔁</span>
                                <span>Recurring ({donation.recurrenceFrequency})</span>
                              </span>
                            ) : 'One-time'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Purpose</span>
                          <span className="font-medium capitalize">
                            {donation.purpose.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Anonymous</span>
                          <span className="font-medium">
                            {donation.isAnonymous ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {donation.notes && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">Your Note:</p>
                        <p className="text-gray-700 italic">"{donation.notes}"</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Transaction ID</p>
                        <p className="font-mono text-gray-900">{donation.paymentReference}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="text-gray-900 capitalize">{donation.paymentGateway}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Payment Date</p>
                        <p className="text-gray-900">{formatDate(donation.paymentDate || donation.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Receipt Number</p>
                        <p className="font-mono text-gray-900">{donation.receiptNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium mb-1">
                        Tax Deductible Donation
                      </p>
                      <p className="text-sm text-blue-700">
                        This receipt is valid for tax purposes under Section 18A of the Income Tax Act.
                        Keep this receipt for your records.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 bg-linear-to-r from-[#F5F9E8] to-[#E8F4E0] rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👨‍🎓</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                  <p className="text-sm text-gray-600">
                    Your donation could provide school supplies for 5 children
                  </p>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Community</h4>
                  <p className="text-sm text-gray-600">
                    Supports community development projects in rural areas
                  </p>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💼</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Business</h4>
                  <p className="text-sm text-gray-600">
                    Helps small business owners access training and resources
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Receipt Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleDownloadReceipt}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#9FC93B] hover:bg-[#8AB82F] text-white rounded-xl font-medium transition-all duration-200"
                >
                  <Download className="h-5 w-5" />
                  Download Receipt (PDF)
                </button>
                
                <button
                  onClick={handleSendReceipt}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200"
                >
                  <Mail className="h-5 w-5" />
                  Email Receipt
                </button>
                
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-medium transition-all duration-200"
                >
                  <Share2 className="h-5 w-5" />
                  Share Your Support
                </button>

                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all duration-200"
                >
                  <Printer className="h-5 w-5" />
                  Print Receipt
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleMakeAnotherDonation}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-linear-to-r from-[#01311B] to-[#024d2f] hover:opacity-90 text-white rounded-xl font-medium transition-all duration-200"
                >
                  <Gift className="h-5 w-5" />
                  Make Another Donation
                </button>
                
                <Link
                  href="/about"
                  className="block"
                >
                  <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700 rounded-xl font-medium transition-all duration-200">
                    <ExternalLink className="h-5 w-5" />
                    See Our Impact
                  </button>
                </Link>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      Auto-redirect in {countdown}s
                    </span>
                  </div>
                  <button
                    onClick={() => setAutoRedirect(!autoRedirect)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      autoRedirect 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {autoRedirect ? 'ON' : 'OFF'}
                  </button>
                </div>
                
                <button
                  onClick={handleGoHome}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-300 hover:border-green-400 hover:bg-green-50 text-gray-700 rounded-xl font-medium transition-all duration-200"
                >
                  <Home className="h-5 w-5" />
                  {donation?.user ? 'Go to Connect Hub' : 'Return Home'}
                </button>
              </div>
            </div>

            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">What's Next?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Monthly Updates</p>
                    <p className="text-sm text-gray-600">Receive impact reports every month</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Tax Certificate</p>
                    <p className="text-sm text-gray-600">Annual tax certificate in February</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Special Invitations</p>
                    <p className="text-sm text-gray-600">Invites to donor events and updates</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <a
                  href="mailto:info@ruralchamber.co.za"
                  className="block text-center py-2 px-4 text-[#9FC93B] hover:text-[#8AB82F] font-medium text-sm"
                >
                  Email Donations Team
                </a>
                <a
                  href="tel:+27111234567"
                  className="block text-center py-2 px-4 text-gray-600 hover:text-gray-900 text-sm"
                >
                  Call: +27 11 123 4567
                </a>
                <p className="text-xs text-gray-500 text-center">
                  Mon-Fri, 8am-5pm SAST
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-linear-to-r from-[#01311B] to-[#024d2f] text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">Together We Make a Difference</h3>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Your support today helps create lasting change in communities across South Africa.
              From education to entrepreneurship, every donation brings us closer to our vision.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-300" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-300" />
                <span>Tax Deductible</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-300" />
                <span>Regular Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-300" />
                <span>Transparent Reporting</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, XCircle, MapPin, Calendar, Users, Home, Mail, Download, Share2, ExternalLink, Printer } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { TRIP_PAYMENT_API } from '@/app/api/endpoints/rest-api/trips/trips';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';

export default function TripPaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [trip, setTrip] = useState<any>(null);

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    
    console.log('🔍 Search params:', Object.fromEntries(searchParams.entries()));
    console.log('🔍 Extracted reference:', reference);
    
    if (!reference) {
      toast.error('Payment reference missing');
      router.push('/connect-hub');
      return;
    }

    verifyPayment(reference);
  }, [searchParams]);

  const verifyPayment = async (reference: string) => {
    try {
      setVerifying(true);
      console.log('🔍 Verifying payment with reference:', reference);

      const response = await TRIP_PAYMENT_API.VERIFY_PAYMENT(reference);
      
      console.log('📊 Verification API response:', response);

      if (response.error) {
        console.error('❌ Verification API error:', response.message);
        
        const bookingResponse = await TRIP_PAYMENT_API.GET_BOOKING_BY_REFERENCE(reference);
        if (!bookingResponse.error && bookingResponse.data) {
          console.log('📊 Found booking via direct lookup:', bookingResponse.data);
          
          if (bookingResponse.data.status === 'confirmed') {
            setSuccess(true);
            setBooking(bookingResponse.data);
            
            if (bookingResponse.data.trip) {
              setTrip(bookingResponse.data.trip);
            }
            
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
            
            toast.success('Payment successful! Your booking is confirmed.');
            setVerifying(false);
            return;
          }
        }
        
        setSuccess(false);
        toast.error(response.message || 'Payment verification failed');
        return;
      }

      if (response.data?.status === 'success') {
        setSuccess(true);
        setBooking(response.data.booking);
        
        if (response.data.booking?.trip) {
          setTrip(response.data.booking.trip);
        }

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        toast.success('Payment successful! Your booking is confirmed.');
      } else {
        setSuccess(false);
        toast.error('Payment verification failed');
      }
    } catch (error: any) {
      console.error('❌ Verification error:', error);
      setSuccess(false);
      toast.error('Failed to verify payment');
    } finally {
      setVerifying(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadReceipt = () => {
    if (!booking || !trip) {
      toast.error('Booking information not available');
      return;
    }
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24);
      pdf.setTextColor(1, 49, 27);
      pdf.text('TRIP BOOKING CONFIRMATION', 105, 30, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Rural Chamber of Commerce', 105, 40, { align: 'center' });
      pdf.text('Trip Booking Receipt', 105, 46, { align: 'center' });
      
      pdf.setDrawColor(159, 201, 59);
      pdf.setLineWidth(0.5);
      pdf.line(20, 50, 190, 50);
      
      let yPos = 60;
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(1, 49, 27);
      pdf.text('RECEIPT DETAILS', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Receipt Number: TRIP-${booking.id}`, 20, yPos);
      pdf.text(`Date: ${formatDate(booking.bookingDate || new Date())}`, 120, yPos);
      yPos += 7;
      
      pdf.text(`Transaction ID: ${booking.paymentReference}`, 20, yPos);
      yPos += 7;
      
      pdf.text(`Status: ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}`, 20, yPos);
      yPos += 15;
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(1, 49, 27);
      pdf.text('TRIP INFORMATION', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Trip: ${trip.title}`, 20, yPos);
      yPos += 7;
      
      pdf.text(`Destination: ${trip.destination}`, 20, yPos);
      yPos += 7;
      
      pdf.text(`Dates: ${trip.dates}`, 20, yPos);
      yPos += 7;
      
      pdf.text(`Time: ${trip.time}`, 20, yPos);
      yPos += 15;
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(1, 49, 27);
      pdf.text('BOOKING DETAILS', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Number of Slots: ${booking.numberOfSlots}`, 20, yPos);
      yPos += 7;
      
      pdf.text(`Price per Slot: ${formatCurrency(booking.totalAmount / booking.numberOfSlots)}`, 20, yPos);
      yPos += 7;
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(1, 49, 27);
      pdf.text(`Total Amount: ${formatCurrency(booking.totalAmount)}`, 20, yPos);
      yPos += 15;
      
      pdf.setFontSize(14);
      pdf.text('PAYMENT INFORMATION', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Payment Method: Paystack', 20, yPos);
      yPos += 7;
      
      pdf.text(`Payment Date: ${formatDate(booking.bookingDate || new Date())}`, 20, yPos);
      yPos += 7;
      
      pdf.text(`Transaction Reference: ${booking.paymentReference}`, 20, yPos);
      yPos += 20;
      
      pdf.setFillColor(245, 249, 232);
      pdf.rect(20, yPos, 170, 25, 'F');
      pdf.setTextColor(1, 49, 27);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('IMPORTANT NOTES', 25, yPos + 8);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text('• Keep this receipt for your records', 25, yPos + 15);
      pdf.text('• Present this receipt at trip check-in', 25, yPos + 22);
      
      yPos += 40;
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Thank you for booking with Rural Chamber of Commerce', 105, yPos, { align: 'center' });
      pdf.text('For questions, contact: info@ruralchamber.co.za', 105, yPos + 5, { align: 'center' });
      pdf.text(`© ${new Date().getFullYear()} Rural Chamber of Commerce`, 105, yPos + 15, { align: 'center' });
      
      pdf.save(`trip-receipt-TRIP-${booking.id}.pdf`);
      
      toast.success('Receipt downloaded successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate receipt');
    }
  };

  const handleShare = async () => {
    if (!trip || !booking) {
      toast.error('Booking information not available');
      return;
    }

    const shareText = `🎉 I just booked a trip to ${trip.destination}!

Trip: ${trip.title}
Dates: ${trip.dates}
Slots: ${booking.numberOfSlots}

Join me on this amazing journey with Rural Chamber of Commerce!

#TravelWithRCC #${trip.destination.replace(/\s+/g, '')}`;

    const shareUrl = `${window.location.origin}/connect-hub`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Trip to ${trip.destination}`,
          text: shareText,
          url: shareUrl,
        });
        toast.success('Shared successfully!');
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          handleFallbackShare(shareText);
        }
      }
    } else {
      handleFallbackShare(shareText);
    }
  };

  const handleFallbackShare = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        toast.success('Message copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy to clipboard');
      });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        toast.success('Message copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy to clipboard');
      }
      document.body.removeChild(textarea);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-16 w-16 text-[#9FC93B] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (!success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h2>
          <p className="text-gray-600 mb-8">
            We couldn't verify your payment. Please try again or contact support if the problem persists.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/connect-hub/trips')}
              className="w-full px-6 py-3 bg-[#9FC93B] text-white rounded-lg hover:bg-[#8AB82F] font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Home className="h-5 w-5" />
              Back to Trips
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trip booking has been confirmed. Check your email for confirmation details.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
                  <p className="text-lg font-bold text-gray-900">TRIP-{booking?.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Amount</p>
                  <p className="text-lg font-bold text-[#9FC93B]">
                    {booking?.totalAmount ? formatCurrency(booking.totalAmount) : 'N/A'}
                  </p>
                </div>
              </div>

              {trip && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Trip Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#9FC93B] mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">{trip.title}</p>
                        <p className="text-gray-600">{trip.destination}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#9FC93B] shrink-0" />
                      <p className="text-gray-700">{trip.dates}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-[#9FC93B] shrink-0" />
                      <p className="text-gray-700">
                        {booking?.numberOfSlots} {booking?.numberOfSlots === 1 ? 'slot' : 'slots'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-blue-50 rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Check Your Email</h3>
                  <p className="text-gray-700">
                    We've sent a confirmation email with your booking details and trip information. 
                    Please check your inbox and spam folder.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleDownloadReceipt}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#9FC93B] hover:bg-[#8AB82F] text-white rounded-xl font-medium transition-all duration-200"
                >
                  <Download className="h-5 w-5" />
                  Download Receipt (PDF)
                </button>
                
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-medium transition-all duration-200"
                >
                  <Share2 className="h-5 w-5" />
                  Share Your Trip
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

            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">What's Next?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Trip Preparation</p>
                    <p className="text-sm text-gray-600">We'll send trip details 2 weeks before departure</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Check Your Email</p>
                    <p className="text-sm text-gray-600">Important updates will be sent via email</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Connect with Attendees</p>
                    <p className="text-sm text-gray-600">Join the trip group chat for networking</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/connect-hub/trips')}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-linear-to-r from-[#01311B] to-[#024d2f] hover:opacity-90 text-white rounded-xl font-medium transition-all duration-200"
                >
                  <Calendar className="h-5 w-5" />
                  View More Trips
                </button>
                
                <button
                  onClick={() => router.push('/connect-hub')}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-300 hover:border-green-400 hover:bg-green-50 text-gray-700 rounded-xl font-medium transition-all duration-200"
                >
                  <Home className="h-5 w-5" />
                  Go to Connect Hub
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from 'react';
import { X, User, Mail, Phone, Building, Calendar, Download, DollarSign, MapPin, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useToast } from '@/components/common/Toast';

interface RegisteredUsersModalProps {
  type: 'event' | 'trip';
  itemId: number;
  itemTitle: string;
  registrations?: any[];
  bookings?: any[];
  onClose: () => void;
}

export default function RegisteredUsersModal({ 
  type, 
  itemId, 
  itemTitle, 
  registrations = [], 
  bookings = [], 
  onClose 
}: RegisteredUsersModalProps) {
  const { showToast } = useToast();
  const [exporting, setExporting] = useState(false);

  const data = type === 'event' ? registrations : bookings;
  const totalCount = type === 'event' 
    ? registrations.length 
    : bookings.reduce((sum, b) => sum + (b.numberOfSlots || 0), 0);

  const exportToCSV = () => {
    try {
      setExporting(true);
      let csvContent = "";
      
      if (type === 'event') {
        csvContent += "Registration ID,Name,Email,Phone,Membership Type,Registration Date,Status\n";
        registrations.forEach(reg => {
          const user = reg.user || {};
          const registration = reg.registration || {};
          const fullName = user.fullName || `${registration.firstName || ''} ${registration.lastName || ''}`.trim();
          const email = user.email || registration.email || '';
          const phone = user.cellphone || registration.cellphone || '';
          const membershipType = registration.membershipType || 'N/A';
          const registrationDate = formatDate(reg.registrationDate);
          const status = reg.status || 'pending';
          
          csvContent += `${reg.id},"${fullName}","${email}","${phone}","${membershipType}","${registrationDate}","${status}"\n`;
        });
      } else {
        csvContent += "Booking ID,Name,Email,Phone,Membership Type,Slots,Total Amount,Booking Date,Status,Payment Reference\n";
        bookings.forEach(booking => {
          const user = booking.user || {};
          const registration = booking.registration || {};
          const fullName = user.fullName || `${registration.firstName || ''} ${registration.lastName || ''}`.trim();
          const email = user.email || registration.email || '';
          const phone = user.cellphone || registration.cellphone || '';
          const membershipType = registration.membershipType || 'N/A';
          const slots = booking.numberOfSlots || 0;
          const totalAmount = booking.totalAmount || 0;
          const bookingDate = formatDate(booking.bookingDate);
          const status = booking.status || 'pending';
          const paymentReference = booking.paymentReference || '';
          
          csvContent += `${booking.id},"${fullName}","${email}","${phone}","${membershipType}",${slots},${totalAmount},"${bookingDate}","${status}","${paymentReference}"\n`;
        });
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${type}-${itemId}-${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast('Data exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showToast('Failed to export data', 'error');
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  const getStatusIcon = (status: string) => {
    if (!status) return null;
    
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {type === 'event' ? 'Event Registrations' : 'Trip Bookings'} - {itemTitle}
              </h3>
              <p className="text-gray-600 mt-1">
                {type === 'event' 
                  ? `${registrations.length} registered user${registrations.length !== 1 ? 's' : ''}` 
                  : `${bookings.length} booking${bookings.length !== 1 ? 's' : ''} (${totalCount} total slot${totalCount !== 1 ? 's' : ''})`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                disabled={exporting || data.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-[#01311B] text-white rounded-lg hover:bg-[#024d2f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {exporting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Download size={18} />
                )}
                {exporting ? 'Exporting...' : 'Export CSV'}
              </button>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          {data.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-700">
                {type === 'event' ? 'No Registrations Yet' : 'No Bookings Yet'}
              </h4>
              <p className="text-gray-500">
                {type === 'event' 
                  ? 'No users have registered for this event yet.' 
                  : 'No users have booked this trip yet.'}
              </p>
            </div>
          ) : type === 'event' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {registrations.map(reg => {
                const user = reg.user || {};
                const registration = reg.registration || {};
                const fullName = user.fullName || `${registration.firstName || ''} ${registration.lastName || ''}`.trim() || 'Unknown User';
                const email = user.email || registration.email || 'No email';
                const phone = user.cellphone || registration.cellphone || 'No phone';
                const membershipType = registration.membershipType || 'No membership';
                const status = reg.status || 'pending';
                
                return (
                  <div key={reg.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#9FC93B] text-white rounded-full flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{fullName}</h4>
                        <p className="text-sm text-gray-600 truncate">{membershipType}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={16} />
                        <span className="truncate" title={email}>{email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={16} />
                        <span className="truncate" title={phone}>{phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span>{formatDate(reg.registrationDate)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        ID: {reg.id}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => {
                const user = booking.user || {};
                const registration = booking.registration || {};
                const trip = booking.trip || {};
                const fullName = user.fullName || `${registration.firstName || ''} ${registration.lastName || ''}`.trim() || 'Unknown User';
                const email = user.email || registration.email || 'No email';
                const phone = user.cellphone || registration.cellphone || 'No phone';
                const membershipType = registration.membershipType || 'N/A';
                const status = booking.status || 'pending';
                
                return (
                  <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                          <User size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{fullName}</h4>
                          <p className="text-sm text-gray-600">Booking #{booking.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {getStatusIcon(status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">User Details</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-400 shrink-0" />
                            <span className="text-sm truncate" title={email}>{email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400 shrink-0" />
                            <span className="text-sm truncate" title={phone}>{phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-gray-400 shrink-0" />
                            <span className="text-sm">{membershipType} Member</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Booking Details</p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Slots:</span>
                            <span className="font-medium">{booking.numberOfSlots || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Amount:</span>
                            <span className="font-medium flex items-center">
                              <DollarSign size={12} className="mr-1" />
                              {formatCurrency(booking.totalAmount)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Booking Date:</span>
                            <span className="text-sm">{formatDate(booking.bookingDate)}</span>
                          </div>
                          {booking.paymentReference && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Payment Ref:</span>
                              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded truncate max-w-[150px]" 
                                    title={booking.paymentReference}>
                                {booking.paymentReference}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {trip.destination && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={14} className="shrink-0" />
                          <span className="truncate">{trip.destination} • {trip.dates || 'No dates'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
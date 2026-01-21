'use client'

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Phone, Mail, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { CONTACT_API, IContactRequest } from '@/app/api/endpoints/rest-api/contact/contact';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showPopup = (type: 'success' | 'error', message: string) => {
    if (type === 'success') {
      setShowSuccessPopup(true);
      setShowErrorPopup(false);
    } else {
      setShowErrorPopup(true);
      setShowSuccessPopup(false);
    }
    setPopupMessage(message);
    
    setTimeout(() => {
      if (type === 'success') {
        setShowSuccessPopup(false);
      } else {
        setShowErrorPopup(false);
      }
      setPopupMessage('');
    }, 5000);
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showPopup('error', 'Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const contactData: IContactRequest = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        service: formData.service || undefined
      };

      const response = await CONTACT_API.SUBMIT_CONTACT(contactData);
      
      if (response.error) {
        throw new Error(response.message || 'Failed to send message');
      }
      
      if (response.data && response.data.success) {
        
        showPopup('success', 'Message sent successfully! We will get back to you soon.');
        
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          service: '',
          message: ''
        });
        setErrors({});
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err: any) {
      console.error('Error submitting contact form:', err);
      showPopup('error', err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }
    }
  };

  const popupVariants: Variants = {
    hidden: { opacity: 0, y: -50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -50, scale: 0.9 }
  };

  return (
    <div className="w-full bg-white py-16 sm:py-20 lg:py-24">
      {showSuccessPopup && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={popupVariants}
          transition={{ duration: 0.3 }}
          className="fixed top-6 right-6 z-50 max-w-md"
        >
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg shadow-lg p-4">
            <div className="flex items-start">
              <div className="shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{popupMessage}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setShowSuccessPopup(false)}
                    className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600 transition-colors"
                  >
                    <span className="sr-only">Dismiss</span>
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {showErrorPopup && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={popupVariants}
          transition={{ duration: 0.3 }}
          className="fixed top-6 right-6 z-50 max-w-md"
        >
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-lg p-4">
            <div className="flex items-start">
              <div className="shrink-0">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{popupMessage}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setShowErrorPopup(false)}
                    className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600 transition-colors"
                  >
                    <span className="sr-only">Dismiss</span>
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="space-y-6"
          >
            <div className="relative w-full h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.8461234567890!2d28.0123456789012!3d-26.1234567890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDA3JzI0LjQiUyAyOMKwMDAnNDQuNCJF!5e0!3m2!1sen!2sza!4v1234567890123!5m2!1sen!2sza"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center gap-3 bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="w-12 h-12 bg-[#01311B] rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Phone Number</h3>
                  <p className="text-sm text-gray-600">+27 00 000 0000</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center gap-3 bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="w-12 h-12 bg-[#01311B] rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Email Address</h3>
                  <p className="text-xs text-gray-600 wrap-break-word px-1">info@ruralchamber.co.za</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center gap-3 bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="w-12 h-12 bg-[#01311B] rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Physical Address</h3>
                  <p className="text-sm text-gray-600">Johannesburg, South Africa</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="bg-white"
          >
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#01311B] mb-4">
                Contact Us
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                Get in touch today for reliable, professional hygiene and cleaning solutions.
                Call, email, or message us — we're here to help!
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Ex: Jhon Smith"
                    className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent transition-all duration-200 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ex: 0786376524"
                    className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent transition-all duration-200 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ex: jhonsmith@gmail.com"
                    className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-semibold text-gray-900 mb-2">
                    Which Services do you need ?
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent transition-all duration-200 bg-white"
                    disabled={loading}
                  >
                    <option value="">Sales and Repairs</option>
                    <option value="Sales and Repairs">Sales and Repairs</option>
                    <option value="Business Support Services">Business Support Services</option>
                    <option value="Training and Workshops">Training and Workshops</option>
                    <option value="Networking Opportunities">Networking Opportunities</option>
                    <option value="Market Access Support">Market Access Support</option>
                    <option value="Advocacy and Policy Influence">Advocacy and Policy Influence</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Type your message here..."
                  className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent resize-none transition-all duration-200 ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <motion.button
                onClick={handleSubmit}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading}
                className={`w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-lg transition-all duration-300 shadow-md flex items-center justify-center gap-3 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-[#9FC93B] hover:bg-[#8AB82F] hover:shadow-lg text-white'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
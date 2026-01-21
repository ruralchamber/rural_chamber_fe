'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, CheckCircle, AlertCircle } from 'lucide-react';
import { SUBSCRIPTION_API } from '@/app/api/endpoints/rest-api/subscriber/subscriber';
import { toast } from 'sonner';

interface ObjectiveLink {
  text: string;
  href?: string;
}

interface FooterProps {
  logo?: string;
  tagline?: string;
  description?: string;
  objectives?: ObjectiveLink[];
  copyrightYear?: number;
  companyName?: string;
  poweredByText?: string;
  poweredByLogo?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
}

export const Footer: React.FC<FooterProps> = ({
  logo = '/logo2.png',
  tagline = 'Empowering Rural Communities for a Prosperous Future',
  description = "The Rural Chamber of Commerce and Industry is dedicated to empowering South Africa's rural communities by promoting economic growth, entrepreneurship, and sustainable development. Through advocacy, training, business support services, and networking opportunities, we strive to create a vibrant business ecosystem that drives job creation, reduces poverty, and unlocks the potential of rural industries. Together, we are shaping a prosperous future for rural South Africa.",
  objectives = [
    { text: 'Promote rural economic development' },
    { text: 'Provide business support services' },
    { text: 'Advocate for rural business interests',  },
    { text: 'Foster partnerships and collaborations',  },
    { text: 'Develop rural entrepreneurship',  }
  ],
  copyrightYear = 2025,
  companyName = 'Rural Chamber of Commerce',
  poweredByText = 'POWERED BY',
  poweredByLogo = '/his.png',
  socialLinks = {
    twitter: '#',
    facebook: '#',
    instagram: '#',
    youtube: '#'
  }
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await SUBSCRIPTION_API.SUBSCRIBE_EMAIL({
        email: email.trim(),
        source: 'footer_subscription'
      });

      if (response.data?.success) {
        setSubscriptionSuccess(true);
        toast.success(response.data.message || 'Successfully subscribed! Check your email for confirmation.');
        
        
        setEmail('');
        
        
        setTimeout(() => {
          setSubscriptionSuccess(false);
        }, 5000);
      } else {
        toast.error(response.data?.message || 'Failed to subscribe. Please try again.');
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      
      
      if (err.message.includes('already subscribed')) {
        toast.error('This email is already subscribed to our newsletter');
      } else if (err.message.includes('Valid email')) {
        toast.error('Please enter a valid email address');
      } else {
        toast.error('Failed to subscribe, the email may already be subscribed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="w-full bg-white border-t border-gray-200">

      {subscriptionSuccess && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-3">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800">
                Thank you for subscribing! Please check your email for confirmation.
              </p>
            </div>
          </div>
        </div>
      )}


      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          <div className="lg:col-span-5 text-center items-center flex flex-col justify-center">
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Contact Us For<br />More Information
              </h3>
            </div>


            <div className="mb-6">
              <Image
                src={logo}
                alt="Rural Chamber Logo"
                width={300}
                height={200}
                className="w-auto"
              />
            </div>

            <p className="text-base max-w-xs text-orange-600 font-medium mb-6">
              {tagline}
            </p>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-lg font-bold text-gray-900 mb-6">Objectives</h4>
            <ul className="space-y-3">
              {objectives.map((objective, index) => (
                <li key={index}>
                  <a
                    href={objective.href}
                    className="text-sm text-gray-600 hover:text-[#9FC93B] transition-colors duration-200"
                  >
                    {objective.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-lg font-bold text-gray-900 mb-6">Subscribe to Newsletter</h4>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent transition-all ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                {email && validateEmail(email) && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
              
              <button
                onClick={handleSubscribe}
                disabled={isLoading || !email.trim() || !validateEmail(email)}
                className={`w-full px-6 py-3 bg-[#9FC93B] text-white text-sm font-medium rounded-md transition-all duration-300 flex items-center justify-center gap-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#8AB82F]'
                } ${
                  (!email.trim() || !validateEmail(email)) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Subscribing...
                  </>
                ) : (
                  'Start Now'
                )}
              </button>

              <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mt-4">
                <p className="text-xs text-blue-800">
                  By subscribing, you agree to receive our newsletter with updates on rural business opportunities, training, and community success stories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 pb-8">
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>

        <div className="relative w-full h-1 my-4">
          <Image
            src="/Divider.png"
            alt="Divider"
            width={1200}
            height={2}
            className="w-full h-1 object-cover"
          />
        </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
         
          <p className="text-sm text-gray-600">
            Copyright © {copyrightYear} {companyName}
          </p>

          
          <div className="flex items-center gap-4">
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white rounded hover:opacity-90 transition-opacity duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {socialLinks.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
          </div>


          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 tracking-wider">
              {poweredByText}
            </span>
            {poweredByLogo ? (
              <Image
                src={poweredByLogo}
                alt="Powered by logo"
                width={130}
                height={30}
                className="w-auto"
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="text-xs font-medium text-gray-700">Connecting The World Through Code</div>
                <div className="text-xl font-bold text-[#9FC93B]">HIS</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
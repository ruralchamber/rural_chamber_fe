'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Search } from 'lucide-react';
import { REGISTRATION_API, LocationSearchResult } from '@/app/api/endpoints/rest-api/registration/registration';

interface AddressData {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  suburb: string;
  postalCode: string;
  city: string;
  district: string;
  province: string;
  country: string;
  isSouthAfrican: boolean;
}

interface AddressDetailsStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  onNext: (data: AddressData) => void;
  isLoading?: boolean;
}

export const AddressDetailsStep = ({
  data,
  onNext,
  isLoading = false,
}: AddressDetailsStepProps) => {
  const [formData, setFormData] = useState<AddressData>({
    addressLine1: data.addressLine1 || "",
    addressLine2: data.addressLine2 || "",
    addressLine3: data.addressLine3 || "",
    suburb: data.suburb || data.addressLine3 || "",
    postalCode: data.postalCode || "",
    city: data.city || "",
    district: data.district || "",
    province: data.province || "",
    country: data.country || "South Africa",
    isSouthAfrican: data.isSouthAfrican !== undefined ? data.isSouthAfrican : true,
  });

  const [errors, setErrors] = useState<Partial<AddressData>>({});


  const [searchQuery, setSearchQuery] = useState(formData.suburb || "");
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field: keyof AddressData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSuburbSearch = async (query: string) => {
    setSearchQuery(query);
    handleInputChange('suburb', query);
    handleInputChange('addressLine3', query);

    if (query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await REGISTRATION_API.SEARCH_LOCATIONS(query);
      if (!response.error && response.data) {
        setSearchResults(response.data);
        setShowDropdown(true);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Location search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (location: LocationSearchResult) => {
    setFormData(prev => ({
      ...prev,
      suburb: location.suburb,
      addressLine3: location.suburb,
      city: location.city,
      province: location.province,
      postalCode: location.postalCode,
      country: "South Africa"
    }));

    setSearchQuery(location.suburb);
    setShowDropdown(false);
    setErrors({}); // Clear errors
  };

  const validateForm = () => {
    const newErrors: Partial<AddressData> = {};

    if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address Line 1 is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.province.trim()) newErrors.province = "Province is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal Code is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    // For SA, ensure suburb is entered
    if (formData.isSouthAfrican && !formData.suburb.trim()) {
      newErrors.suburb = "Suburb is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Address Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Country Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country / Region *
          </label>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.isSouthAfrican}
                onChange={() => handleInputChange('isSouthAfrican', true)}
                className="text-[#9FC93B] focus:ring-[#9FC93B]"
              />
              <span className="text-sm text-gray-700">South Africa</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={!formData.isSouthAfrican}
                onChange={() => handleInputChange('isSouthAfrican', false)}
                className="text-[#9FC93B] focus:ring-[#9FC93B]"
              />
              <span className="text-sm text-gray-700">International</span>
            </label>
          </div>
        </div>

        {/* Address Line 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 1 (Street Address) *
          </label>
          <input
            type="text"
            value={formData.addressLine1}
            onChange={(e) => handleInputChange('addressLine1', e.target.value)}
            className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="e.g., 123 Main Street"
          />
          {errors.addressLine1 && (
            <p className="text-sm text-red-500 mt-1">{errors.addressLine1}</p>
          )}
        </div>

        {/* Address Line 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address Line 2 (Building/Unit)
          </label>
          <input
            type="text"
            value={formData.addressLine2}
            onChange={(e) => handleInputChange('addressLine2', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm"
          />
        </div>

        {/* --- SOUTH AFRICAN AUTOCOMPLETE --- */}
        {formData.isSouthAfrican ? (
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Suburb * (Type to search)
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSuburbSearch(e.target.value)}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm pl-10 ${errors.suburb ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Start typing your suburb..."
                autoComplete="off"
              />
              <div className="absolute left-3 top-3.5 text-gray-400">
                {isSearching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </div>
            </div>

            {/* Dropdown Results */}
            {showDropdown && searchResults.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {searchResults.map((result) => (
                  <li
                    key={`${result.id}-${result.postalCode}`}
                    onClick={() => handleSelectLocation(result)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-gray-900">{result.suburb}</span>
                        <span className="text-sm text-gray-500 ml-2">{result.city}, {result.province}</span>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {result.postalCode}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {showDropdown && searchResults.length === 0 && searchQuery.length > 2 && !isSearching && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-gray-500 text-sm">
                No suburbs found. Please try a different spelling.
              </div>
            )}

            {errors.suburb && (
              <p className="text-sm text-red-500 mt-1">{errors.suburb}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Select your suburb to automatically fill City, Province, and Code.
            </p>
          </div>
        ) : (
          // International Suburb Input (Manual)
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Suburb / District
            </label>
            <input
              type="text"
              value={formData.suburb}
              onChange={(e) => handleInputChange('suburb', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City - ReadOnly for SA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City / Town *
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              readOnly={formData.isSouthAfrican}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${formData.isSouthAfrican ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
                } ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
          </div>

          {/* Postal Code - ReadOnly for SA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code *
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              readOnly={formData.isSouthAfrican}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${formData.isSouthAfrican ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
                } ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.postalCode && <p className="text-sm text-red-500 mt-1">{errors.postalCode}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Province - ReadOnly for SA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province / State *
            </label>
            {formData.isSouthAfrican ? (
              <input
                type="text"
                value={formData.province}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed text-sm"
              />
            ) : (
              <input
                type="text"
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${errors.province ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
            )}
            {errors.province && <p className="text-sm text-red-500 mt-1">{errors.province}</p>}
          </div>

          {/* Country - ReadOnly for SA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              readOnly={formData.isSouthAfrican}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${formData.isSouthAfrican ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
                } ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#9FC93B] hover:bg-[#89B534] text-white font-medium py-3 rounded-md transition-colors duration-200 text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Address...
            </>
          ) : (
            'Continue to Personal Details'
          )}
        </button>
      </form>
    </div>
  );
};
'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AddressData {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
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
    postalCode: data.postalCode || "",
    city: data.city || "",
    district: data.district || "",
    province: data.province || "",
    country: data.country || "South Africa",
    isSouthAfrican: data.isSouthAfrican !== undefined ? data.isSouthAfrican : true,
  });

  const [errors, setErrors] = useState<Partial<AddressData>>({});

  const handleInputChange = (field: keyof AddressData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<AddressData> = {};

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address Line 1 is required";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    if (formData.isSouthAfrican) {
      if (!formData.city.trim()) {
        newErrors.city = "City is required for South African addresses";
      }
      if (!formData.province.trim()) {
        newErrors.province = "Province is required for South African addresses";
      }
    } else {
      if (!formData.city.trim()) {
        newErrors.city = "City is required";
      }
      if (!formData.country.trim()) {
        newErrors.country = "Country is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onNext(formData);
  };

  const southAfricanProvinces = [
    "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
    "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape"
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Address Details</h2>
      <p className="text-gray-500 text-sm mb-6">
        Please provide your address information
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Country Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Are you based in South Africa?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="isSouthAfrican"
                checked={formData.isSouthAfrican}
                onChange={() => handleInputChange('isSouthAfrican', true)}
                className="mr-2 text-[#9FC93B] focus:ring-[#9FC93B]"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="isSouthAfrican"
                checked={!formData.isSouthAfrican}
                onChange={() => handleInputChange('isSouthAfrican', false)}
                className="mr-2 text-[#9FC93B] focus:ring-[#9FC93B]"
              />
              No
            </label>
          </div>
        </div>

        {!formData.isSouthAfrican && (
          <div>
            <input
              type="text"
              placeholder="Country *"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.country && (
              <p className="text-sm text-red-500 mt-1">{errors.country}</p>
            )}
          </div>
        )}

        {/* Address Line 1 */}
        <div>
          <input
            type="text"
            placeholder="Address Line 1 * (Street address, building name, etc.)"
            value={formData.addressLine1}
            onChange={(e) => handleInputChange('addressLine1', e.target.value)}
            className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.addressLine1 && (
            <p className="text-sm text-red-500 mt-1">{errors.addressLine1}</p>
          )}
        </div>

        {/* Address Line 2 */}
        <div>
          <input
            type="text"
            placeholder="Address Line 2 (Apartment, suite, unit, etc.)"
            value={formData.addressLine2}
            onChange={(e) => handleInputChange('addressLine2', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm"
          />
        </div>

        {/* Suburb/Village */}
        <div>
          <input
            type="text"
            placeholder="Suburb/Village/Isigodi/Ilali"
            value={formData.addressLine3}
            onChange={(e) => handleInputChange('addressLine3', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Postal Code */}
          <div>
            <input
              type="text"
              placeholder="Postal Code *"
              value={formData.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${errors.postalCode ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.postalCode && (
              <p className="text-sm text-red-500 mt-1">{errors.postalCode}</p>
            )}
          </div>

          {/* City */}
          <div>
            <input
              type="text"
              placeholder="City *"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.city && (
              <p className="text-sm text-red-500 mt-1">{errors.city}</p>
            )}
          </div>
        </div>

        {formData.isSouthAfrican && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* District */}
            <div>
              <input
                type="text"
                placeholder="District"
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm"
              />
            </div>

            {/* Province */}
            <div>
              <select
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
                className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${errors.province ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                <option value="">Select Province *</option>
                {southAfricanProvinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="text-sm text-red-500 mt-1">{errors.province}</p>
              )}
            </div>
          </div>
        )}

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
'use client';

import React, { useState } from 'react';

interface CompanyData {
  companyName: string;
  organizationType: string;
  registrationNumber: string;
  sector: string;
  website: string;
  telephone: string;
  notes: string;
}

interface CompanyDetailsStepProps {
  data: any;
  onNext: (data: CompanyData) => void;
  onBack: () => void;
}

const SECTORS = [
  "Agriculture",
  "Construction",
  "Education",
  "Energy",
  "Finance",
  "Government",
  "Healthcare",
  "Manufacturing",
  "Media & Entertainment",
  "Non-Profit",
  "Professional Services",
  "Retail",
  "Technology",
  "Transportation",
  "Other",
];

const ORGANIZATION_TYPES = [
  "Private Company",
  "Public Company",
  "Non-Profit Organization",
  "Government Entity",
  "Partnership",
  "Sole Proprietorship",
];

export const CompanyDetailsStep = ({
  data,
  onNext,
  onBack,
}: CompanyDetailsStepProps) => {
  const [formData, setFormData] = useState<CompanyData>({
    companyName: data.companyName || "",
    organizationType: data.organizationType || "",
    registrationNumber: data.registrationNumber || "",
    sector: data.sector || "",
    website: data.website || "",
    telephone: data.telephone || "",
    notes: data.notes || "",
  });

  const [errors, setErrors] = useState<Partial<CompanyData>>({});

  const handleInputChange = (field: keyof CompanyData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<CompanyData> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.organizationType.trim()) {
      newErrors.organizationType = "Organization type is required";
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required";
    } else if (data.isSouthAfrican) {
      const validCompanyFormat = /^\d{4}\/\d{6}\/\d{2}$/;
      if (!validCompanyFormat.test(formData.registrationNumber)) {
        newErrors.registrationNumber = "South African registration number format: YYYY/NNNNNN/CC";
      }
    }

    if (!formData.sector.trim()) {
      newErrors.sector = "Sector is required";
    }

    if (!formData.notes.trim()) {
      newErrors.notes = "Please provide information about your business needs";
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

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Organization Details</h2>
      <p className="text-gray-500 text-sm mb-6">
        Please provide information about your organization
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Name */}
        <div>
          <input
            type="text"
            placeholder="Company Name *"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${
              errors.companyName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.companyName && (
            <p className="text-sm text-red-500 mt-1">{errors.companyName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Organization Type */}
          <div>
            <select
              value={formData.organizationType}
              onChange={(e) => handleInputChange('organizationType', e.target.value)}
              className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${
                errors.organizationType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Organization Type *</option>
              {ORGANIZATION_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.organizationType && (
              <p className="text-sm text-red-500 mt-1">{errors.organizationType}</p>
            )}
          </div>

          {/* Sector */}
          <div>
            <select
              value={formData.sector}
              onChange={(e) => handleInputChange('sector', e.target.value)}
              className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${
                errors.sector ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sector *</option>
              {SECTORS.map((sector) => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
            {errors.sector && (
              <p className="text-sm text-red-500 mt-1">{errors.sector}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Registration Number */}
          <div>
            <input
              type="text"
              placeholder={
                data.isSouthAfrican 
                  ? "Registration Number * (e.g., 2024/123456/07)" 
                  : "Registration Number *"
              }
              value={formData.registrationNumber}
              onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
              className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${
                errors.registrationNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.registrationNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.registrationNumber}</p>
            )}
          </div>

          {/* Telephone */}
          <div>
            <input
              type="tel"
              placeholder="Telephone Number"
              value={formData.telephone}
              onChange={(e) => handleInputChange('telephone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm"
            />
          </div>
        </div>

        {/* Website */}
        <div>
          <input
            type="url"
            placeholder="Website (optional)"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm"
          />
        </div>

        {/* Notes */}
        <div>
          <textarea
            placeholder="What are your current business needs and requirements? *"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${
              errors.notes ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.notes && (
            <p className="text-sm text-red-500 mt-1">{errors.notes}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-md transition-colors duration-200 text-sm"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#9FC93B] hover:bg-[#89B534] text-white font-medium py-3 rounded-md transition-colors duration-200 text-sm"
          >
            Continue to Membership
          </button>
        </div>
      </form>
    </div>
  );
};
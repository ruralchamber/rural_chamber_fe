'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface PersonalDetailsData {
  gender: string;
  dateOfBirth: string;
  idNumber: string;
  passport: string;
  notes: string;
  accountType: "individual" | "organizational";
}

interface PersonalDetailsStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  onNext: (data: PersonalDetailsData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const PersonalDetailsStep = ({
  data,
  onNext,
  onBack,
  isLoading = false,
}: PersonalDetailsStepProps) => {
  const [formData, setFormData] = useState<PersonalDetailsData>({
    gender: data.gender || "",
    dateOfBirth: data.dateOfBirth || "",
    idNumber: data.idNumber || "",
    passport: data.passport || "",
    notes: data.notes || "",
    accountType: data.accountType || "individual",
  });

  const [errors, setErrors] = useState<Partial<PersonalDetailsData>>({});

  const handleInputChange = (field: keyof PersonalDetailsData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<PersonalDetailsData> = {};

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = "You must be at least 18 years old";
      }
    }

    if (data.isSouthAfrican) {
      if (!formData.idNumber.trim()) {
        newErrors.idNumber = "ID Number is required for South African residents";
      } else if (!/^\d{13}$/.test(formData.idNumber)) {
        newErrors.idNumber = "ID Number must be exactly 13 digits";
      } else if (formData.dateOfBirth) {
        // Validate that ID matches Date of Birth (YYMMDD)
        const yy = formData.dateOfBirth.substring(2, 4);
        const mm = formData.dateOfBirth.substring(5, 7);
        const dd = formData.dateOfBirth.substring(8, 10);
        const expectedPrefix = `${yy}${mm}${dd}`;

        if (!formData.idNumber.startsWith(expectedPrefix)) {
          newErrors.idNumber = "ID Number must match the Date of Birth (YYMMDD)";
        }
      }
    } else {
      if (!formData.passport.trim()) {
        newErrors.passport = "Passport number is required for international residents";
      }
    }

    if (formData.accountType === "individual" && !formData.notes.trim()) {
      newErrors.notes = "Please provide details of your business requirements";
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
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {formData.accountType === "individual" ? "Personal Details" : "Organization Representative Details"}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        {formData.accountType === "individual"
          ? "Please provide your personal information"
          : "Please provide information about your organization's representative"}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Type *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer ${formData.accountType === "individual" ? "bg-gray-50 border-[#9FC93B]" : "border-gray-300"
              }`}>
              <input
                type="radio"
                name="accountType"
                value="individual"
                checked={formData.accountType === "individual"}
                onChange={(e) => handleInputChange('accountType', e.target.value)}
                className="text-[#9FC93B] focus:ring-[#9FC93B]"
              />
              <div>
                <span className="font-medium">Individual</span>
                <p className="text-sm text-gray-500">For entrepreneurs and small business owners</p>
              </div>
            </label>
            <label className={`flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer ${formData.accountType === "organizational" ? "bg-gray-50 border-[#9FC93B]" : "border-gray-300"
              }`}>
              <input
                type="radio"
                name="accountType"
                value="organizational"
                checked={formData.accountType === "organizational"}
                onChange={(e) => handleInputChange('accountType', e.target.value)}
                className="text-[#9FC93B] focus:ring-[#9FC93B]"
              />
              <div>
                <span className="font-medium">Organizational</span>
                <p className="text-sm text-gray-500">For companies and organizations</p>
              </div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className="text-sm text-red-500 mt-1">{errors.gender}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth *
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>
            )}
          </div>
        </div>

        {data.isSouthAfrican ? (
          <div>
            <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
              South African ID Number *
            </label>
            <input
              id="idNumber"
              type="text"
              placeholder="Enter 13-digit ID"
              value={formData.idNumber}
              onChange={(e) => handleInputChange('idNumber', e.target.value)}
              className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${errors.idNumber ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.idNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.idNumber}</p>
            )}
          </div>
        ) : (
          <div>
            <label htmlFor="passport" className="block text-sm font-medium text-gray-700 mb-1">
              Passport Number *
            </label>
            <input
              id="passport"
              type="text"
              placeholder="Enter passport number"
              value={formData.passport}
              onChange={(e) => handleInputChange('passport', e.target.value)}
              className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${errors.passport ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.passport && (
              <p className="text-sm text-red-500 mt-1">{errors.passport}</p>
            )}
          </div>
        )}

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Business Requirements *
          </label>
          <textarea
            id="notes"
            placeholder={
              formData.accountType === "individual"
                ? "What are your current business needs and requirements?"
                : "What are your organization's current business needs?"
            }
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 border text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9FC93B] text-sm ${errors.notes ? 'border-red-500' : 'border-gray-300'
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
            disabled={isLoading}
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-md transition-colors duration-200 text-sm disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-[#9FC93B] hover:bg-[#89B534] text-white font-medium py-3 rounded-md transition-colors duration-200 text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              formData.accountType === "individual" ? "Continue to Membership" : "Continue to Company Details"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function InvestorReadinessAssessment() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    annualRevenue: '',
    yearsInOperation: '',
    hasFinancialStatements: '',
    hasFormalizedStructure: '',
    seekingInvestmentAmount: '',
    useOfFunds: '',
    currentChallenges: '',
    growthPlan: '',
  });

  const questions = [
    {
      id: 'businessName',
      question: 'What is your business name?',
      type: 'text',
      required: true,
    },
    {
      id: 'industry',
      question: 'What industry does your business operate in?',
      type: 'select',
      required: true,
      options: [
        'Agriculture',
        'Manufacturing',
        'Retail & Trade',
        'Technology & IT',
        'Construction',
        'Professional Services',
        'Healthcare',
        'Education',
        'Hospitality & Tourism',
        'Transportation & Logistics',
        'Other',
      ],
    },
    {
      id: 'yearsInOperation',
      question: 'How many years has your business been operating?',
      type: 'select',
      required: true,
      options: [
        'Less than 1 year',
        '1-2 years',
        '3-5 years',
        '6-10 years',
        'More than 10 years',
      ],
    },
    {
      id: 'annualRevenue',
      question: 'What is your estimated annual revenue (ZAR)?',
      type: 'select',
      required: true,
      options: [
        'Less than R100,000',
        'R100,000 - R500,000',
        'R500,000 - R1 million',
        'R1 million - R5 million',
        'R5 million - R10 million',
        'More than R10 million',
      ],
    },
    {
      id: 'hasFinancialStatements',
      question: 'Do you have audited or reviewed financial statements?',
      type: 'radio',
      required: true,
      options: ['Yes', 'No', 'In Progress'],
    },
    {
      id: 'hasFormalizedStructure',
      question: 'Does your business have a formalized organizational structure with defined roles?',
      type: 'radio',
      required: true,
      options: ['Yes', 'Partially', 'No'],
    },
    {
      id: 'seekingInvestmentAmount',
      question: 'How much investment are you seeking (ZAR)?',
      type: 'select',
      required: true,
      options: [
        'Less than R500,000',
        'R500,000 - R1 million',
        'R1 million - R5 million',
        'R5 million - R10 million',
        'R10 million - R50 million',
        'More than R50 million',
      ],
    },
    {
      id: 'useOfFunds',
      question: 'What will you use the investment for?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe how you plan to use the investment funds...',
    },
    {
      id: 'currentChallenges',
      question: 'What are your biggest challenges in attracting investors?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe your main challenges...',
    },
    {
      id: 'growthPlan',
      question: 'Describe your growth plan for the next 3-5 years',
      type: 'textarea',
      required: true,
      placeholder: 'Describe your vision and growth strategy...',
    },
  ];

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    const currentQuestion = questions[currentStep];
    if (currentQuestion.required && !formData[currentQuestion.id as keyof typeof formData]) {
      toast.error('Please answer this question before continuing');
      return;
    }
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
     
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      
      toast.success('Assessment submitted successfully!', {
        description: 'Your investor readiness assessment has been received.',
        duration: 4000,
        position: 'top-center',
      });

      
      setTimeout(() => {
        router.push('/client/economic-zone');
      }, 2000);
      
    } catch (error: any) {
      toast.error('Failed to submit assessment', {
        description: error.message || 'Please try again later.',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentStep];
    
    return (
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">
              Question {currentStep + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-[#9FC93B]">
              {Math.round(((currentStep + 1) / questions.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#9FC93B] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {question.question}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </h2>

        {question.type === 'text' && (
          <input
            type="text"
            value={formData[question.id as keyof typeof formData]}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#9FC93B] focus:outline-none text-lg"
            placeholder="Enter your answer..."
          />
        )}

        {question.type === 'select' && (
          <select
            value={formData[question.id as keyof typeof formData]}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#9FC93B] focus:outline-none text-lg appearance-none bg-white"
          >
            <option value="">Select an option...</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        {question.type === 'radio' && (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label
                key={option}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData[question.id as keyof typeof formData] === option
                    ? 'border-[#9FC93B] bg-[#F5F9E8]'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={formData[question.id as keyof typeof formData] === option}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className="w-5 h-5 text-[#9FC93B] focus:ring-[#9FC93B]"
                />
                <span className="ml-3 text-lg text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'textarea' && (
          <textarea
            value={formData[question.id as keyof typeof formData]}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={6}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#9FC93B] focus:outline-none text-lg resize-none"
          />
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
     
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Investor Readiness Assessment
                </h1>
                <p className="text-gray-600 mt-1">
                  Complete this assessment to evaluate your business's investment readiness
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
          {renderQuestion()}

         
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            {currentStep < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-[#9FC93B] text-white rounded-lg font-medium hover:bg-[#8AB82F] transition-colors"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-[#9FC93B] text-white rounded-lg font-medium hover:bg-[#8AB82F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Invest Request
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your assessment will be reviewed by our team</li>
                <li>• You'll receive a detailed readiness report</li>
                <li>• We'll provide personalized recommendations</li>
                <li>• Our team may contact you for follow-up discussions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
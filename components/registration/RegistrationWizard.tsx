/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/common/AuthLayout";
import { InitialRegistrationStep } from "./steps/InitialRegistrationStep";
import { EmailVerificationStep } from "./steps/EmailVerificationStep";
import { AddressDetailsStep } from "./steps/AddressDetailsStep";
import { PersonalDetailsStep } from "./steps/PersonalDetailsStep";
import { CompanyDetailsStep } from "./steps/CompanyDetailsStep";
import { MembershipSelectionStep } from "./steps/MembershipSelectionStep";
import { PaymentStep } from "./steps/PaymentStep";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { REGISTRATION_API } from "@/app/api/endpoints/rest-api/registration/registration";

export interface RegistrationData {
  email: string;
  cellphone: string;
  firstName: string;
  lastName: string;
  password: string;
  accountType: "individual" | "organizational";
  membershipType: string;
  membershipAmount: number;
  billingFrequency: "monthly" | "annual";
  notes?: string;
  gender?: string;
  dateOfBirth?: string;
  idNumber?: string;
  passport?: string;
  organizationType?: string;
  companyName: string;
  registrationNumber: string;
  sector: string;
  vatNumber?: string;
  website?: string;
  telephone?: string;
  companyEmail?: string;
  country: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  suburb?: string;
  postalCode: string;
  city?: string;
  district?: string;
  province?: string;
  stateProvince?: string;
  isSouthAfrican: boolean;
  id?: number;
  userId?: number;
}

function RegistrationWizardContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchParamsInitialized, setSearchParamsInitialized] = useState(false);

  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    email: "",
    cellphone: "",
    firstName: "",
    lastName: "",
    password: "",
    accountType: "individual",
    membershipType: "",
    membershipAmount: 0,
    billingFrequency: "annual",
    country: "",
    addressLine1: "",
    postalCode: "",
    companyName: "",
    registrationNumber: "",
    sector: "",
    isSouthAfrican: false,
  });

  const router = useRouter();

  useEffect(() => {
    const loadExistingRegistration = async () => {
      try {
        const userData = localStorage.getItem("user_data");
        const registrationInProgress = localStorage.getItem("registration_in_progress");

        if (userData && registrationInProgress === "true") {
          const user = JSON.parse(userData);
          setCurrentUser(user);

          try {
            const progressResponse = await REGISTRATION_API.GET_PROGRESS(user.id);
            if (!progressResponse.error && progressResponse.data) {
              const { registration, currentStep: savedStep, steps } = progressResponse.data;

              let restoredData = { ...registrationData };

              if (registration) {
                restoredData = {
                  ...restoredData,
                  ...registration,
                  email: registration.email || user.email || "",
                };
              }

              steps?.forEach((step: any) => {
                if (step.data) {
                  restoredData = { ...restoredData, ...step.data };
                }
              });

              setRegistrationData(restoredData);

              if (savedStep && savedStep > 1) {
                setCurrentStep(savedStep);

                const emailVerifiedStep = steps?.find((step: any) =>
                  step.stepNumber === 2 && step.stepData?.emailVerified === true
                );

                if (emailVerifiedStep) {
                  setEmailVerified(true);
                }
              }

              setSearchParamsInitialized(true);
              return;
            }
          } catch (error) {
            console.warn("Could not restore from backend");
          }

          const savedRegistrationData = localStorage.getItem("registration_data");
          const savedStep = localStorage.getItem("current_registration_step");
          const savedEmailVerified = localStorage.getItem("email_verified");

          if (savedRegistrationData) {
            try {
              const parsedData = JSON.parse(savedRegistrationData);
              setRegistrationData(prev => ({ ...prev, ...parsedData }));
            } catch (e) {
              console.error("Failed to parse saved registration data:", e);
            }
          }

          if (savedStep) {
            const stepNum = parseInt(savedStep);
            if (!isNaN(stepNum) && stepNum > 1) {
              setCurrentStep(stepNum);
            }
          }

          if (savedEmailVerified === "true") {
            setEmailVerified(true);
          }
        }

        const urlParams = new URLSearchParams(window.location.search);
        const verified = urlParams.get("verified");

        if (verified === "true" && userData) {
          const user = JSON.parse(userData);
          setCurrentUser(user);
          setEmailVerified(true);

          localStorage.setItem("email_verified", "true");
          localStorage.setItem("registration_in_progress", "true");

          const savedStep = localStorage.getItem("current_registration_step");
          if (savedStep === "2") {
            setCurrentStep(3);
            localStorage.setItem("current_registration_step", "3");
          } else if (!savedStep) {
            setCurrentStep(3);
            localStorage.setItem("current_registration_step", "3");
          }

          window.history.replaceState({}, document.title, window.location.pathname);

          toast.success("Email verified! Continue with your registration.");
        }

      } catch (error) {
        console.error("Failed to load existing registration:", error);
      } finally {
        setSearchParamsInitialized(true);
      }
    };

    loadExistingRegistration();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateRegistrationData = (updates: Partial<RegistrationData>) => {
    setRegistrationData((prev) => ({ ...prev, ...updates }));
  };

  const handleInitialRegistration = async (data: {
    email: string;
    cellphone: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await REGISTRATION_API.START_REGISTRATION({
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        role: "customer",
        cellphone: data.cellphone,
      });

      if (response.error) {
        const errorMessage = response.message || "Registration failed. Please try again.";

        if (response.status === 409 || errorMessage.includes("already exists") || errorMessage.includes("already completed")) {
          toast.error("User already exists. Please login.", {
            duration: 6000,
            action: {
              label: "Go to Login",
              onClick: () => {
                router.push("/auth/login");
              },
            },
          });
          return;
        }

        toast.error(errorMessage, { duration: 6000 });
        return;
      }

      const { user, tokenData, resumeStep, isNewUser } = response.data;

      const userData = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      };

      localStorage.setItem("user_data", JSON.stringify(userData));
      localStorage.setItem("access_token", tokenData.accessToken);
      localStorage.setItem("refresh_token", tokenData.refreshToken);
      localStorage.setItem("registration_in_progress", "true");

      const startStep = resumeStep || (isNewUser ? 2 : 1);
      localStorage.setItem("current_registration_step", startStep.toString());

      const stepData = {
        email: data.email,
        cellphone: data.cellphone,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password
      };
      localStorage.setItem("registration_data", JSON.stringify(stepData));

      setCurrentUser(userData);
      updateRegistrationData(data);
      setCurrentStep(startStep);

      if (isNewUser) {
        toast.success(
          "Registration started! Please check your email to verify your account.",
          { duration: 6000 }
        );
      } else {
        toast.success(
          "Welcome back! Please continue your registration from where you left off.",
          { duration: 6000 }
        );
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      const errorMessage = error.response?.data?.message || error.message || "Unable to complete registration.";

      if (error.response?.status === 409 || errorMessage.includes("already exists") || errorMessage.includes("already completed")) {
        toast.error("User already exists. Please login.", {
          duration: 6000,
          action: {
            label: "Go to Login",
            onClick: () => {
              router.push("/auth/login");
            },
          },
        });
        return;
      }

      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  const saveStepToBackend = async (
    stepNumber: number,
    stepData: any
  ): Promise<boolean> => {
    if (!currentUser) {
      toast.info("Please start your registration again.", {
        duration: 5000,
        action: {
          label: "Start Over",
          onClick: handleStartFresh,
        },
      });
      return false;
    }

    try {
      const response = await REGISTRATION_API.SAVE_STEP({
        userId: currentUser.id,
        stepNumber,
        stepData,
      });

      if (response.error) {
        if (response.message) {
          toast.info(response.message, { duration: 5000 });
        } else {
          toast.info("Unable to save your progress.", { duration: 5000 });
        }
        return false;
      }

      localStorage.setItem("registration_in_progress", "true");
      localStorage.setItem("current_registration_step", stepNumber.toString());

      const currentData = {
        ...registrationData,
        ...stepData
      };
      localStorage.setItem("registration_data", JSON.stringify(currentData));

      return true;
    } catch (error: any) {
      console.error("Failed to save step:", error);

      if (error.response?.data?.message) {
        toast.info(error.response.data.message, { duration: 5000 });
      } else {
        toast.info("Unable to save your progress.", { duration: 5000 });
      }
      return false;
    }
  };

  const checkSessionValidity = async (): Promise<boolean> => {
    if (!currentUser) {
      return false;
    }

    try {
      const response = await REGISTRATION_API.GET_PROGRESS(currentUser.id);
      return !response.error;
    } catch (error) {
      return false;
    }
  };

  const handleAddressDetails = async (data: any) => {
    setIsLoading(true);
    try {
      const sessionValid = await checkSessionValidity();
      if (!sessionValid) {
        toast.info("Your session has expired. Please start registration again.");
        handleStartFresh();
        return;
      }

      updateRegistrationData(data);
      const saved = await saveStepToBackend(3, data);
      if (saved) {
        setCurrentStep(4);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalDetails = async (data: any) => {
    setIsLoading(true);
    try {
      const sessionValid = await checkSessionValidity();
      if (!sessionValid) {
        toast.info("Your session has expired. Please start registration again.");
        handleStartFresh();
        return;
      }

      updateRegistrationData(data);
      const saved = await saveStepToBackend(4, data);
      if (saved) {
        if (data.accountType === "individual") {
          setCurrentStep(6);
        } else {
          setCurrentStep(5);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyDetails = async (data: any) => {
    setIsLoading(true);
    try {
      const sessionValid = await checkSessionValidity();
      if (!sessionValid) {
        toast.info("Your session has expired. Please start registration again.");
        handleStartFresh();
        return;
      }

      updateRegistrationData(data);
      const saved = await saveStepToBackend(5, data);
      if (saved) {
        setCurrentStep(6);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMembershipSelection = async (data: any) => {
    setIsLoading(true);
    try {
      const sessionValid = await checkSessionValidity();
      if (!sessionValid) {
        toast.info("Your session has expired. Please start registration again.");
        handleStartFresh();
        return;
      }

      updateRegistrationData(data);
      const saved = await saveStepToBackend(6, data);

      if (saved) {
        if (data.membershipAmount > 0) {
          setCurrentStep(7);
        } else {
          const submissionSuccess = await handleFinalSubmission();
          if (submissionSuccess) {
            toast.success(
              "Registration complete! Welcome to Rural Chamber of Commerce!"
            );
            localStorage.removeItem("registration_in_progress");
            localStorage.removeItem("registration_data");
            localStorage.removeItem("current_registration_step");
            localStorage.removeItem("continue_registration");
            localStorage.removeItem("email_verified");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user_data");
            router.push("/auth/login");
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmission = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!currentUser) {
        throw new Error("User not found");
      }

      const response = await REGISTRATION_API.COMPLETE_REGISTRATION({
        userId: currentUser.id,
        finalData: registrationData,
      });

      if (response.error) {
        throw new Error(response.message || "Failed to complete registration");
      }

      localStorage.removeItem("registration_in_progress");
      localStorage.removeItem("registration_data");
      localStorage.removeItem("current_registration_step");
      localStorage.removeItem("continue_registration");
      localStorage.removeItem("email_verified");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_data");

      toast.success(
        "Registration complete! Welcome to Rural Chamber of Commerce! Please login with your credentials."
      );

      router.push("/auth/login");

      return true;
    } catch (error: any) {
      toast.info(
        error.message || "Failed to complete registration. Please try again."
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async (email: string) => {
    try {
      await REGISTRATION_API.RESEND_VERIFICATION(email);
      toast.success("Verification email sent successfully!");
    } catch (error: any) {
      toast.info(error.message || "Failed to send verification email");
    }
  };

  const handleEmailVerified = async () => {
    setEmailVerified(true);
    localStorage.setItem("email_verified", "true");
    await saveStepToBackend(2, { emailVerified: true });
    setCurrentStep(3);
    toast.success("Email verified! Continue with your registration.");
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Create Account";
      case 2:
        return "Verify Email";
      case 3:
        return "Address Information";
      case 4:
        return "Personal Details";
      case 5:
        return "Company Details";
      case 6:
        return "Choose Membership";
      case 7:
        return "Payment";
      default:
        return "Registration";
    }
  };

  const getTotalSteps = () => {
    if (registrationData.accountType === "individual") {
      return registrationData.membershipAmount === 0 ? 6 : 7;
    }
    return registrationData.membershipAmount === 0 ? 7 : 8;
  };

  const getProgress = () => {
    return (currentStep / getTotalSteps()) * 100;
  };

  const renderCurrentStep = () => {
    // Check initial loading state from session restoration
    if (!searchParamsInitialized) {
      return (
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading registration...</p>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <InitialRegistrationStep
            data={registrationData}
            onSubmit={handleInitialRegistration}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <EmailVerificationStep
            email={registrationData.email}
            onVerified={handleEmailVerified}
            onResendEmail={handleEmailVerification}
          />
        );
      case 3:
        return (
          <AddressDetailsStep
            data={registrationData}
            onNext={handleAddressDetails}
            isLoading={isLoading}
          />
        );
      case 4:
        return (
          <PersonalDetailsStep
            data={registrationData}
            onNext={handlePersonalDetails}
            onBack={() => !isLoading && setCurrentStep(3)}
            isLoading={isLoading}
          />
        );
      case 5:
        return registrationData.accountType === "organizational" ? (
          <CompanyDetailsStep
            data={registrationData}
            onNext={handleCompanyDetails}
            onBack={() => !isLoading && setCurrentStep(4)}
            isLoading={isLoading}
          />
        ) : null;
      case 6:
        return (
          <MembershipSelectionStep
            data={registrationData}
            onNext={handleMembershipSelection}
            onBack={() =>
              !isLoading && setCurrentStep(
                registrationData.accountType === "organizational" ? 5 : 4
              )
            }
            isLoading={isLoading}
          />
        );
      case 7:
        return (
          <PaymentStep
            data={{
              email: registrationData.email,
              firstName: registrationData.firstName,
              lastName: registrationData.lastName,
              membershipType: registrationData.membershipType,
              amount: registrationData.membershipAmount,
              billingFrequency: registrationData.billingFrequency,
            }}
            onBack={() => setCurrentStep(6)}
            onSuccess={() => {
              localStorage.removeItem("registration_in_progress");
              localStorage.removeItem("registration_data");
              localStorage.removeItem("current_registration_step");
              localStorage.removeItem("continue_registration");
              localStorage.removeItem("email_verified");
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              localStorage.removeItem("user_data");
              toast.success("Payment completed! Registration finished.");
              router.push("/auth/login");
            }}
          />
        );
      default:
        return null;
    }
  };

  const handleStartFresh = () => {
    if (!window.confirm("Are you sure you want to start over? All your progress will be lost.")) {
      return;
    }

    localStorage.removeItem("registration_in_progress");
    localStorage.removeItem("registration_data");
    localStorage.removeItem("current_registration_step");
    localStorage.removeItem("email_verified");
    localStorage.removeItem("continue_registration");

    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    const userData = localStorage.getItem("user_data");

    localStorage.clear();

    if (accessToken) localStorage.setItem("access_token", accessToken);
    if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
    if (userData) localStorage.setItem("user_data", userData);

    setCurrentStep(1);
    setRegistrationData({
      email: "",
      cellphone: "",
      firstName: "",
      lastName: "",
      password: "",
      accountType: "individual",
      membershipType: "",
      membershipAmount: 0,
      billingFrequency: "annual",
      country: "",
      addressLine1: "",
      postalCode: "",
      companyName: "",
      registrationNumber: "",
      sector: "",
      isSouthAfrican: false,
    });
    setCurrentUser(null);
    setEmailVerified(false);

    toast.success("Starting fresh registration...");
  };

  if (!searchParamsInitialized) {
    return (
      <AuthLayout rightImage="/signup.png" rightTitle="Where Growth Begins.">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading registration...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout rightImage="/signup.png" rightTitle="Where Growth Begins.">
      <div className="w-full">
        {currentStep === 1 && (
          <div className="text-right mb-4">
            <button
              onClick={handleStartFresh}
              className="text-sm text-gray-600 hover:text-[#9FC93B] underline"
            >
              Clear form and start fresh
            </button>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Rural Chamber of Commerce Registration
          </h1>
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Step {currentStep} of {getTotalSteps()}
              </span>
              <span>{getStepTitle()}</span>
            </div>
            <Progress value={getProgress()} className="w-full h-2" />
          </div>
        </div>

        <div className="bg-white rounded-lg">{renderCurrentStep()}</div>
      </div>
    </AuthLayout>
  );
}

export default function RegistrationWizard() {
  return (
    <Suspense
      fallback={
        <AuthLayout rightImage="/signup.png" rightTitle="Where Growth Begins.">
          <div className="flex justify-center items-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading registration form...</p>
            </div>
          </div>
        </AuthLayout>
      }
    >
      <RegistrationWizardContent />
    </Suspense>
  );
}
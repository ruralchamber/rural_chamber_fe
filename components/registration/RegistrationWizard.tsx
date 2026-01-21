"use client";

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
    const clearRegistrationData = () => {
      const keysToKeep = [
        "access_token",
        "refresh_token",
        "accessToken",
        "refreshToken",
      ];
      const storage: { [key: string]: string | null } = {};

      keysToKeep.forEach((key) => {
        storage[key] = localStorage.getItem(key);
      });

      localStorage.clear();

      Object.entries(storage).forEach(([key, value]) => {
        if (value) localStorage.setItem(key, value);
      });
    };

    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get("verified");
    const continueReg = localStorage.getItem("continue_registration");
    const userData = localStorage.getItem("user_data");

    if (verified === "true" && continueReg === "true" && userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setEmailVerified(true);
      setCurrentStep(3);

      setRegistrationData((prev) => ({
        ...prev,
        email: user.email,
        firstName: user.fullName?.split(" ")[0] || "",
        lastName: user.fullName?.split(" ").slice(1).join(" ") || "",
      }));

      localStorage.removeItem("continue_registration");
      localStorage.removeItem("email_verified");

      toast.success("Email verified! Continue with your registration.");
    } else {
      clearRegistrationData();
    }

    setSearchParamsInitialized(true);

    const handleBeforeUnload = () => {
      clearRegistrationData();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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
        if (response.message?.includes("already registered and verified")) {
          toast.error(
            "This email is already registered. Please login instead.",
            {
              duration: 6000,
              action: {
                label: "Go to Login",
                onClick: () => router.push("/auth/login"),
              },
            }
          );
          return;
        }

        throw new Error(response.message || "Registration failed");
      }

      const userData = {
        id: response.data.user.id,
        email: response.data.user.email,
        fullName: response.data.user.fullName,
      };

      localStorage.setItem("user_data", JSON.stringify(userData));
      localStorage.setItem("access_token", response.data.tokenData.accessToken);
      localStorage.setItem(
        "refresh_token",
        response.data.tokenData.refreshToken
      );

      setCurrentUser(userData);
      updateRegistrationData(data);
      setCurrentStep(2);

      toast.success(
        "Registration successful! Please check your email to verify your account.",
        { duration: 6000 }
      );
    } catch (error: any) {
      console.error("Registration error:", error);

      let errorMessage =
        "This email is already registered and verified. Please login instead.";

      if (error.message?.includes("already exists")) {
        errorMessage =
          "This email is already in use. Please use a different email or login.";
      } else if (error.message) {
        errorMessage = error.message;
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
      toast.error("User session not found. Please start registration again.", {
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
        if (response.message?.includes("User not found")) {
          toast.error(
            "Your session has expired. Please start registration again.",
            {
              duration: 5000,
              action: {
                label: "Start Over",
                onClick: handleStartFresh,
              },
            }
          );
          return false;
        }

        toast.error(
          response.message || "Failed to save step. Please try again.",
          { duration: 5000 }
        );
        return false;
      }

      return true;
    } catch (error: any) {
      console.error("Failed to save step:", error);

      let errorMessage = "Failed to save your progress.";

      if (error.message?.includes("not found")) {
        errorMessage =
          "Your session has expired. Please start registration again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        duration: 5000,
        action: {
          label: "Start Over",
          onClick: handleStartFresh,
        },
      });
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
    const sessionValid = await checkSessionValidity();
    if (!sessionValid) {
      toast.error("Your session has expired. Please start registration again.");
      handleStartFresh();
      return;
    }

    updateRegistrationData(data);
    const saved = await saveStepToBackend(3, data);
    if (saved) {
      setCurrentStep(4);
    }
  };

  const handlePersonalDetails = async (data: any) => {
    const sessionValid = await checkSessionValidity();
    if (!sessionValid) {
      toast.error("Your session has expired. Please start registration again.");
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
  };

  const handleCompanyDetails = async (data: any) => {
    const sessionValid = await checkSessionValidity();
    if (!sessionValid) {
      toast.error("Your session has expired. Please start registration again.");
      handleStartFresh();
      return;
    }

    updateRegistrationData(data);
    const saved = await saveStepToBackend(5, data);
    if (saved) {
      setCurrentStep(6);
    }
  };

  const handleMembershipSelection = async (data: any) => {
    const sessionValid = await checkSessionValidity();
    if (!sessionValid) {
      toast.error("Your session has expired. Please start registration again.");
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
          router.push("/connect-hub");
        }
      }
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

      localStorage.removeItem("user_data");
      localStorage.removeItem("continue_registration");
      localStorage.removeItem("email_verified");

      return true;
    } catch (error: any) {
      toast.error(
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
      toast.error(error.message || "Failed to send verification email");
    }
  };

  const handleEmailVerified = async () => {
    setEmailVerified(true);
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
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9FC93B] mx-auto"></div>
            <p className="mt-4 text-gray-600">Processing...</p>
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
          />
        );
      case 4:
        return (
          <PersonalDetailsStep
            data={registrationData}
            onNext={handlePersonalDetails}
            onBack={() => setCurrentStep(3)}
          />
        );
      case 5:
        return registrationData.accountType === "organizational" ? (
          <CompanyDetailsStep
            data={registrationData}
            onNext={handleCompanyDetails}
            onBack={() => setCurrentStep(4)}
          />
        ) : null;
      case 6:
        return (
          <MembershipSelectionStep
            data={registrationData}
            onNext={handleMembershipSelection}
            onBack={() =>
              setCurrentStep(
                registrationData.accountType === "organizational" ? 5 : 4
              )
            }
          />
        );
      case 7:
        return registrationData.membershipAmount > 0 ? (
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
          />
        ) : null;
      default:
        return null;
    }
  };

  const handleStartFresh = () => {
    const keysToKeep = [
      "access_token",
      "refresh_token",
      "accessToken",
      "refreshToken",
    ];
    const storage: { [key: string]: string | null } = {};

    keysToKeep.forEach((key) => {
      storage[key] = localStorage.getItem(key);
    });

    localStorage.clear();

    Object.entries(storage).forEach(([key, value]) => {
      if (value) localStorage.setItem(key, value);
    });

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

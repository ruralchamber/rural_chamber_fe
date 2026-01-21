// app/auth/reset-code/page.tsx
"use client";

import React, { useState, useRef } from "react";
import AuthLayout from "@/components/common/AuthLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AUTH_API } from "@/app/api/endpoints/rest-api/auth/auth";
import { toast } from "sonner";

const ResetCodePage: React.FC = () => {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updatedCode = [...code];
    updatedCode[index] = value;
    setCode(updatedCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = code.join("");

    if (enteredCode.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);

    try {
      // Get email from localStorage or context (you might want to store it when sending OTP)
      const email = localStorage.getItem("resetEmail") || "";

      const response = await AUTH_API.VERIFY_OTP({ email, otp: enteredCode });

      if (response.error === false) {
        toast.success("Code verified successfully");
        // Store OTP in localStorage for password reset
        localStorage.setItem("verifiedOtp", enteredCode);
        localStorage.setItem("resetEmail", email);
        router.push("/auth/new-password");
      } else {
        toast.error(response.message || "Invalid verification code");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);

    try {
      const email = localStorage.getItem("resetEmail") || "";
      const response = await AUTH_API.SEND_OTP({ email });

      if (response.error === false) {
        toast.success("New code sent to your email");
      } else {
        toast.error(response.message || "Failed to resend code");
      }
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      toast.error(error.response?.data?.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      rightImage="/forgot.png"
      rightTitle="Growth isn't a solo journey."
    >
      <div className="text-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Password reset
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          We have sent the code to your email address
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center gap-3 mb-4">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={setInputRef(index)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
                className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9FC93B] focus:border-transparent disabled:opacity-50"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || code.join("").length !== 6}
            className="w-full bg-[#9FC93B] hover:bg-[#89B534] text-white font-medium py-3 rounded-md transition-colors duration-200 text-sm disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? "Verifying..." : "Continue"}
          </button>

          <p className="text-sm text-gray-600 mt-4">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-[#9FC93B] hover:text-[#89B534] font-semibold underline disabled:opacity-50"
            >
              {resending ? "Resending..." : "Click to resend"}
            </button>
          </p>
        </form>

        <div className="text-center text-sm text-gray-600 mt-6">
          <Link
            href="/auth/forgot-password"
            className="text-[#9FC93B] hover:text-[#89B534] font-medium underline"
          >
            Back to Forgot Password
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetCodePage;

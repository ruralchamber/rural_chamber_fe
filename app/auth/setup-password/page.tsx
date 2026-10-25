"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AuthLayout from "@/components/common/AuthLayout";
import { AUTH_API } from "@/app/api/endpoints/rest-api/auth/auth";
import { toast } from "sonner";

function SetupPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await AUTH_API.SETUP_PASSWORD({ token, password });
      if (response?.error || response?.success === false) {
        toast.error(response?.message || "This setup link is invalid or has expired");
        return;
      }
      toast.success("Password saved. You can now sign in.");
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not save the password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout rightImage="/forgot.png" rightTitle="Growth isn't a solo journey.">
      <form onSubmit={submit} className="space-y-4">
        <h1 className="text-2xl font-bold text-[#01311B]">Set your password</h1>
        <p className="text-sm text-gray-600">Choose a password to activate the account an administrator created for you.</p>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="w-full border rounded-lg px-3 py-2" />
        <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className="w-full border rounded-lg px-3 py-2" />
        <button disabled={loading || !token} className="w-full bg-[#01311B] text-white rounded-lg py-2">
          {loading ? "Saving..." : "Save password"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default function SetupPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <SetupPasswordForm />
    </Suspense>
  );
}

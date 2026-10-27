"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { ADMIN_USERS_API } from "@/app/api/endpoints/rest-api/dashboard/users";

const PLANS = [
  "free",
  "individual_silver",
  "individual_gold",
  "individual_platinum",
  "organizational_silver",
  "organizational_gold",
  "organizational_platinum",
];

export function CreateUserModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    cellphone: "",
    role: "customer",
    accountType: "individual",
    subscriptionType: "free",
    billingFrequency: "annual",
  });
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const plans = PLANS.filter((plan) => plan === "free" || plan.startsWith(form.accountType));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await ADMIN_USERS_API.CREATE_USER(form);
      if (response?.error) {
        toast.error(response.message || "Could not create the user");
        return;
      }
      toast.success(response?.data?.emailSent === false
        ? "User created. The welcome email could not be sent."
        : "User created. A password setup email has been sent.");
      onCreated();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not create the user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Add user</h2>
        <label className="block text-sm">
          Full name
          <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
        </label>
        <label className="block text-sm">
          Email
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
        </label>
        <label className="block text-sm">
          Cellphone
          <input value={form.cellphone} onChange={(e) => setForm({ ...form, cellphone: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            Role
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2">
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <label className="block text-sm">
            Account type
            <select value={form.accountType} onChange={(e) => setForm({ ...form, accountType: e.target.value, subscriptionType: "free" })} className="mt-1 w-full border rounded-lg px-3 py-2">
              <option value="individual">Individual</option>
              <option value="organizational">Organizational</option>
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            Membership
            <select value={form.subscriptionType} onChange={(e) => setForm({ ...form, subscriptionType: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2">
              {plans.map((plan) => (
                <option key={plan} value={plan}>{plan.replaceAll("_", " ")}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Billing
            <select value={form.billingFrequency} onChange={(e) => setForm({ ...form, billingFrequency: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2">
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button disabled={saving} className="px-4 py-2 rounded-lg bg-[#01311B] text-white disabled:opacity-50">
            {saving ? "Saving..." : "Create user"}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
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

export function UserAdminPanel({
  userId,
  userData,
  onChanged,
}: {
  userId: number;
  userData: any;
  onChanged: () => void;
}) {
  const [section, setSection] = useState<"profile" | "membership" | "payments" | "audit">("profile");
  const [profile, setProfile] = useState({
    fullName: userData.fullName || "",
    email: userData.email || "",
    cellphone: userData.cellphone || "",
    role: userData.role || "customer",
    isActive: userData.isActive !== false,
  });
  const [membership, setMembership] = useState({
    newSubscriptionType: userData.subscription?.subscriptionType || userData.subscriptionTier || "free",
    newBillingFrequency: userData.subscription?.billingFrequency || "annual",
    timing: "immediate",
    reason: "",
  });
  const [plans, setPlans] = useState<Array<{ type: string; name: string; monthlyAmount: number; annualAmount: number; features: string[] }>>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmMembership, setConfirmMembership] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    ADMIN_USERS_API.GET_PLANS()
      .then((response) => setPlans(response?.data || []))
      .catch(() => setPlans([]));
  }, []);

  useEffect(() => {
    setProfile({
      fullName: userData.fullName || "",
      email: userData.email || "",
      cellphone: userData.cellphone || "",
      role: userData.role || "customer",
      isActive: userData.isActive !== false,
    });
  }, [userData]);

  const saveProfile = async () => {
    setBusy(true);
    try {
      await ADMIN_USERS_API.UPDATE_USER(userId, profile);
      toast.success("User updated");
      onChanged();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not update the user");
    } finally {
      setBusy(false);
    }
  };

  const changeMembership = async () => {
    if (!membership.reason.trim()) {
      setConfirmError("Enter a reason for this membership change.");
      return;
    }
    setConfirmError("");
    setBusy(true);
    try {
      const response = await ADMIN_USERS_API.CHANGE_MEMBERSHIP(userId, membership);
      const data = response?.data;
      toast.success(data?.requiresPayment
        ? "Upgrade recorded. Generate a payment link before the new plan starts."
        : "Membership change saved");
      setConfirmMembership(false);
      onChanged();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Could not change the membership";
      setConfirmError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const removeUser = async () => {
    setBusy(true);
    try {
      await ADMIN_USERS_API.DELETE_USER(userId, deleteReason);
      toast.success("User deleted");
      setConfirmDelete(false);
      onChanged();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not delete the user");
    } finally {
      setBusy(false);
    }
  };

  const restoreUser = async () => {
    setBusy(true);
    try {
      await ADMIN_USERS_API.RESTORE_USER(userId);
      toast.success("User restored");
      onChanged();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not restore the user");
    } finally {
      setBusy(false);
    }
  };

  const copyLink = async (paymentId: number) => {
    try {
      const response = await ADMIN_USERS_API.GENERATE_LINK(paymentId);
      const url = response?.data?.payment?.paymentUrl;
      if (!url) throw new Error("No payment link returned");
      await navigator.clipboard.writeText(url);
      toast.success(response?.data?.reused ? "Existing payment link copied" : "Payment link created and copied");
      onChanged();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Could not create a payment link");
    }
  };

  const emailLink = async (paymentId: number) => {
    try {
      await ADMIN_USERS_API.EMAIL_LINK(paymentId);
      toast.success("Payment reminder sent");
      onChanged();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not send the reminder");
    }
  };

  const subscription = userData.subscription || {};
  const selectedPlan = plans.find((plan) => plan.type === membership.newSubscriptionType);
  const proposedAmount = selectedPlan
    ? membership.newBillingFrequency === "monthly"
      ? selectedPlan.monthlyAmount
      : selectedPlan.annualAmount
    : null;
  const payments = userData.outstandingPayments || [];
  const history = userData.membershipHistory || [];
  const audit = userData.auditHistory || [];
  const paid = userData.paymentHistory || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
      <div className="flex flex-wrap gap-2 mb-6">
        {(["profile", "membership", "payments", "audit"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setSection(item)}
            className={`px-4 py-2 rounded-lg text-sm capitalize ${section === item ? "bg-[#01311B] text-white" : "bg-gray-100 text-gray-700"}`}
          >
            {item}
          </button>
        ))}
      </div>

      {section === "profile" && (
        <div className="space-y-4 max-w-xl">
          <label className="block text-sm">Full name
            <input value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
          </label>
          <label className="block text-sm">Email
            <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
          </label>
          <label className="block text-sm">Cellphone
            <input value={profile.cellphone} onChange={(e) => setProfile({ ...profile, cellphone: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">Role
              <select value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2">
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label className="block text-sm">Account status
              <select value={String(profile.isActive)} onChange={(e) => setProfile({ ...profile, isActive: e.target.value === "true" })} className="mt-1 w-full border rounded-lg px-3 py-2">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <button disabled={busy} onClick={saveProfile} className="px-4 py-2 rounded-lg bg-[#01311B] text-white">Save profile</button>
            {userData.deletedAt ? (
              <button disabled={busy} onClick={restoreUser} className="px-4 py-2 rounded-lg border">Restore user</button>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="px-4 py-2 rounded-lg border border-red-300 text-red-700">Delete user</button>
            )}
          </div>
        </div>
      )}

      {section === "membership" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <Info label="Current plan" value={(subscription.subscriptionType || userData.subscriptionTier || "free").replaceAll("_", " ")} />
            <Info label="Status" value={userData.membershipDisplayStatus || subscription.status || "Pending"} />
            <Info label="Amount" value={`R ${Number(subscription.amount || 0).toFixed(2)}`} />
            <Info label="Renews" value={subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString("en-ZA") : "Not scheduled"} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl">
            <label className="block text-sm">New plan
              <select value={membership.newSubscriptionType} onChange={(e) => setMembership({ ...membership, newSubscriptionType: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2">
                {PLANS.map((plan) => <option key={plan} value={plan}>{plan.replaceAll("_", " ")}</option>)}
              </select>
            </label>
            <label className="block text-sm">Billing
              <select value={membership.newBillingFrequency} onChange={(e) => setMembership({ ...membership, newBillingFrequency: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2">
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </label>
            <label className="block text-sm">When
              <select value={membership.timing} onChange={(e) => setMembership({ ...membership, timing: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2">
                <option value="immediate">Immediately</option>
                <option value="next_cycle">Next billing cycle</option>
              </select>
            </label>
            <label className="block text-sm">Reason
              <input value={membership.reason} onChange={(e) => setMembership({ ...membership, reason: e.target.value })} className="mt-1 w-full border rounded-lg px-3 py-2" />
            </label>
          </div>
          <button type="button" onClick={() => { setConfirmError(""); setConfirmMembership(true); }} className="px-4 py-2 rounded-lg bg-[#01311B] text-white">Review membership change</button>
          {proposedAmount != null && (
            <p className="text-sm text-gray-600">
              Current fee R {Number(subscription.amount || 0).toFixed(2)} · Proposed fee R {Number(proposedAmount).toFixed(2)} ({membership.newBillingFrequency}).
              Immediate upgrades charge the prorated difference and start after Paystack confirms payment.
            </p>
          )}
          <HistoryTable rows={history} />
        </div>
      )}

      {section === "payments" && (
        <div className="space-y-6">
          <PaymentTable title="Outstanding" rows={payments} onCopy={copyLink} onEmail={emailLink} />
          <div>
            <h3 className="font-semibold mb-2">Payment history</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <tbody>
                  {paid.length === 0 && <tr><td className="py-3 text-gray-500">No completed registration payments.</td></tr>}
                  {paid.map((payment: any) => (
                    <tr key={payment.id} className="border-t">
                      <td className="py-2">{payment.reference}</td>
                      <td>R {Number(payment.amount).toFixed(2)}</td>
                      <td className="capitalize">{payment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {section === "audit" && (
        <div className="space-y-3">
          {audit.length === 0 && <p className="text-sm text-gray-500">No administrative changes have been recorded.</p>}
          {audit.map((entry: any) => (
            <div key={entry.id} className="border rounded-lg p-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="font-medium">{entry.action.replaceAll("_", " ")}</span>
                <span className="text-gray-500">{new Date(entry.createdAt).toLocaleString("en-ZA")}</span>
              </div>
              <p className="text-gray-600 mt-1">Administrator #{entry.adminId || "system"}{entry.reason ? ` · ${entry.reason}` : ""}</p>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <Modal title="Delete this user?" onClose={() => setConfirmDelete(false)}>
          <p className="text-sm text-gray-600">The account, membership history, and payments are kept. The user cannot sign in until the account is restored.</p>
          <input value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} placeholder="Reason" className="mt-3 w-full border rounded-lg px-3 py-2" />
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button disabled={busy} onClick={removeUser} className="px-4 py-2 rounded-lg bg-red-700 text-white">Delete user</button>
          </div>
        </Modal>
      )}

      {confirmMembership && (
        <Modal title="Confirm membership change" onClose={() => setConfirmMembership(false)}>
          <p className="text-sm text-gray-600">
            Change this member to {membership.newSubscriptionType.replaceAll("_", " ")} ({membership.newBillingFrequency}), effective {membership.timing === "immediate" ? "now" : "next cycle"}.
            An upgrade that increases the fee creates a prorated Paystack charge and does not start until that payment is confirmed.
          </p>
          <label className="block text-sm mt-4">
            Reason
            <input
              value={membership.reason}
              onChange={(e) => {
                setMembership({ ...membership, reason: e.target.value });
                if (confirmError) setConfirmError("");
              }}
              className="mt-1 w-full border rounded-lg px-3 py-2"
              placeholder="Why is this membership changing?"
            />
          </label>
          {confirmError && <p className="mt-2 text-sm text-red-600">{confirmError}</p>}
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setConfirmMembership(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button
              type="button"
              disabled={busy}
              onClick={changeMembership}
              className="px-4 py-2 rounded-lg bg-[#01311B] text-white disabled:opacity-50"
            >
              {busy ? "Saving..." : "Confirm change"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-lg p-3">
      <p className="text-gray-500">{label}</p>
      <p className="font-medium capitalize">{value}</p>
    </div>
  );
}

function HistoryTable({ rows }: { rows: any[] }) {
  if (!rows.length) return <p className="text-sm text-gray-500">No membership changes yet.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2">When</th><th>Change</th><th>Plans</th><th>Adjustment</th><th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="py-2">{new Date(row.createdAt).toLocaleString("en-ZA")}</td>
              <td className="capitalize">{row.changeType} · {row.timing?.replaceAll("_", " ")}</td>
              <td>{row.previousPlan} → {row.newPlan}</td>
              <td>R {Number(row.billingAdjustment || 0).toFixed(2)}</td>
              <td>{row.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaymentTable({ title, rows, onCopy, onEmail }: { title: string; rows: any[]; onCopy: (id: number) => void; onEmail: (id: number) => void }) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      {rows.length === 0 && <p className="text-sm text-gray-500">No outstanding payments.</p>}
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="border rounded-lg p-3 text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="font-medium">R {Number(row.amount).toFixed(2)} · {row.status}</p>
              <p className="text-gray-500">Due {row.dueDate ? new Date(row.dueDate).toLocaleDateString("en-ZA") : "n/a"} · {row.reference || "No reference yet"} · Emails: {row.emailAttempts || 0} {row.lastEmailStatus || ""}</p>
            </div>
            {row.status !== "paid" && row.status !== "cancelled" && (
              <div className="flex gap-2">
                <button onClick={() => onCopy(row.id)} className="px-3 py-2 border rounded-lg">Copy link</button>
                <button onClick={() => onEmail(row.id)} className="px-3 py-2 rounded-lg bg-[#01311B] text-white">Email link</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        {children}
      </div>
    </div>
  );
}

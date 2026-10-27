"use client";

import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoutes";
import AdminBilling from "@/components/Admin/Billing/AdminBilling";

export default function AdminBillingPage() {
  return (
    <AdminProtectedRoute>
      <AdminBilling />
    </AdminProtectedRoute>
  );
}

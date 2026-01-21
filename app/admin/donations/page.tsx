// app/admin/donations/page.tsx
"use client";

import React from 'react';
import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoutes';
import AdminDonationsPage from '@/components/Admin/Donations/AdminDonation';

function AdminDonationsPageContent() {
  return <AdminDonationsPage />;
}

export default function AdminDonationsPageWrapper() {
  return (
    <AdminProtectedRoute>
      <AdminDonationsPageContent />
    </AdminProtectedRoute>
  );
}
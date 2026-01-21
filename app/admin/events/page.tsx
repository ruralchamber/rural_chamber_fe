// app/admin/events/page.tsx
"use client";

import React from 'react';
import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoutes';
import AdminEventsTripsManager from '@/components/Admin/Events/AdminEvents';

function AdminEventsPageContent() {
  return <AdminEventsTripsManager />;
}

export default function AdminEventsPage() {
  return (
    <AdminProtectedRoute>
      <AdminEventsPageContent />
    </AdminProtectedRoute>
  );
}
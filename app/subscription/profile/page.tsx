// app/subscription/settings/profile/page.tsx
import SubscriptionSettings from '@/components/learning-hub/subscription/SubscriptionSettings';
import LoggedFooter from '@/components/common/LoggedFooter';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import React from 'react';

export default function SubscriptionSettingsPage() {
  return (
    <ProtectedRoute>
      <div>
        <SubscriptionSettings />
        <LoggedFooter />
      </div>
    </ProtectedRoute>
  );
}

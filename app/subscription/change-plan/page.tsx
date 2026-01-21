// app/subscription/change-plan/page.tsx
import UpdateSubscription from '@/components/learning-hub/subscription/ChangeSubscription';
import LoggedFooter from '@/components/common/LoggedFooter';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import React from 'react';

export default function ChangeSubscriptionPage() {
  return (
    <ProtectedRoute>
      <div>
        <UpdateSubscription />
        <LoggedFooter />
      </div>
    </ProtectedRoute>
  );
}

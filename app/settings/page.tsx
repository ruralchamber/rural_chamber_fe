// app/profile/page.tsx
import AccountSettings from '@/components/learning-hub/AccountSetting';
import LoggedFooter from '@/components/common/LoggedFooter';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import React from 'react';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div>
        <AccountSettings />
        <LoggedFooter />
      </div>
    </ProtectedRoute>
  );
}

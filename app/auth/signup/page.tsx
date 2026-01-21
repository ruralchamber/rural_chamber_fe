// app/auth/signup/page.tsx
'use client';

import React, { Suspense } from 'react';
import RegistrationWizard from '@/components/registration/RegistrationWizard';

export default function SignUpPage() {
  return <RegistrationWizard />;
}
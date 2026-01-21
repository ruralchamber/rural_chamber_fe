import VerifyEmailPage from "@/components/auth/VerifyEmail";
import React, { Suspense } from "react";

export default function page() {
  return (
    <div>
      <Suspense>
        <VerifyEmailPage />
      </Suspense>
    </div>
  );
}

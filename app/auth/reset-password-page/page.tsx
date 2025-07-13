// app/auth/reset-password-page/page.tsx
import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <div className="mb-10">
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
        <ResetPasswordClient />
      </Suspense>
    </div>
  );
}

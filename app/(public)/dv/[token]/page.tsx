"use client";

import { useParams } from "next/navigation";
import VerifyForm from "./verify-form";

export default function Page() {
  const { token } = useParams<{ token: string }>();

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-semibold">Verify prescription access</h1>
        <VerifyForm token={token} />
      </div>
    </main>
  );
}

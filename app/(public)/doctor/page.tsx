"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import SignInForm from "@/components/auth/sign-in-form";
import SignUpForm from "@/components/auth/doctor/sign-up-form";

export default function HomePageDashboard() {
  const { data: session, status } = useSession();
  const [initialState, setInitialState] = useState<"signin" | "signup">(
    "signin"
  );

  if (
    status === "authenticated" &&
    sessionStorage.getItem("doctorLogin") &&
    sessionStorage.getItem("doctorLogin") === "true"
  ) {
    redirect("/doctor/dashboard");
  }

  const handleClose = (close: boolean) => {};

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {initialState === "signin" && (
        <SignInForm
          onClose={() => handleClose(false)}
          onSwitchToSignUp={() => setInitialState("signup")}
        />
      )}

      {initialState === "signup" && (
        <SignUpForm
          onClose={() => handleClose(false)}
          onSwitchToSignIn={() => setInitialState("signin")}
        />
      )}
    </div>
  );
}

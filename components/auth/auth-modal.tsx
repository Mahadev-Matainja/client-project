"use client";

import SignInForm from "./sign-in-form";
import SignUpForm from "../../components/auth/signup/page";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "signin" | "signup";
  updateInitialMode: (value: "signin" | "signup") => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "signin",
  updateInitialMode,
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {initialMode === "signin" ? (
        <SignInForm
          onSwitchToSignUp={() => updateInitialMode("signup")}
          onClose={onClose}
        />
      ) : (
        <SignUpForm
          onSwitchToSignIn={() => updateInitialMode("signin")}
          onClose={onClose}
        />
      )}
    </>
  );
}

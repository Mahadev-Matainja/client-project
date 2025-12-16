// Step4Goal.tsx
"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormHeader from "./FormHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RootState } from "@/lib/store";
import { updateGoal, resetSignup } from "@/lib/slices/signupSlice";
import { ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getSession, signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { validateGoal } from "../utils/validation";
import { setAuth } from "@/lib/slices/authSlice";

const healthGoalOptions = [
  "Weight Management",
  "Heart Health",
  "Diabetes Management",
  "Blood Pressure Control",
  "Mental Wellness",
  "Fitness Improvement",
  "Preventive Care",
  "Chronic Disease Management",
];

const preferenceOptions = [
  "Email notifications",
  "SMS alerts",
  "Push notifications",
  "Monthly reports",
];

export default function Step4Goal({
  step,
  setStep,
}: {
  step: number;
  setStep: (n: number) => void;
}) {
  const dispatch = useDispatch();
  const goalState = useSelector((s: RootState) => s.signup.patient.goal);
  const patient = useSelector((s: RootState) => s.signup.patient);
  const router = useRouter();

  const [form, setForm] = React.useState({
    goals: goalState?.goals ?? [],
    preferences: goalState?.preferences ?? [],
    termsAccepted: goalState?.termsAccepted ?? false,
    privacyAccepted: goalState?.privacyAccepted ?? false,
  });

  const [errors, setErrors] = useState<any>({}); //
  const [isLoading, setIsLoading] = useState(false);

  function updateField(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev: any) => ({ ...prev, [key]: "" })); // clear error instantly
  }

  function toggleArray(field: "goals" | "preferences", value: string) {
    updateField(
      field,
      form[field].includes(value)
        ? form[field].filter((x: any) => x !== value)
        : [...form[field], value]
    );
  }

  async function handleRegister() {
    // 1️⃣ VALIDATION FIRST
    const validationErrors = validateGoal(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // ❌ STOP HERE
    }

    // 2️⃣ Save to redux
    dispatch(updateGoal(form));

    const payload = {
      role: "patient",
      basicInfo: patient.personal,
      accountSecurity: patient.account,
      patientHealthInfo: patient.health,
      healthGoals: form,
    };

    // console.log("📌 Final Signup Payload:", payload);

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: data?.message || "Something went wrong!",
        });
        return;
      }

      toast({
        title: "Registration Successful 🎉",
        description: "Account created successfully",
      });

      // Login instantly
      await signIn("credentials", {
        email: payload.basicInfo.email,
        password: payload.accountSecurity.password,
        role: data.data.user.type,
        redirect: false,
      });

      // dispatch(resetSignup());
      const session = await getSession();
      const customer = session?.user?.data?.customer;
      const token = session?.user?.data?.token;
      const role = customer?.type;
      const subType = customer?.subType;
      if (customer && token) {
        dispatch(
          setAuth({
            user: {
              ...customer,
              avatar: customer.avatar ?? undefined,
              role,
              subType,
            },
            token,
          })
        );
      }
      redirect("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Goals */}
      <div className="space-y-2">
        <Label>What are your primary health goals?</Label>

        <div className="grid grid-cols-2 gap-2">
          {healthGoalOptions.map((goal) => (
            <label key={goal} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.goals.includes(goal)}
                onChange={() => toggleArray("goals", goal)}
              />
              <span className="text-sm">{goal}</span>
            </label>
          ))}
        </div>

        {/* 🔴 Error */}
        {/* {errors.goals && <p className="text-red-500 text-sm">{errors.goals}</p>} */}
      </div>

      {/* Preferences */}
      <div className="space-y-2">
        <Label>Preferred notification type</Label>

        <div className="space-y-1">
          {preferenceOptions.map((pref) => (
            <label key={pref} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.preferences.includes(pref)}
                onChange={() => toggleArray("preferences", pref)}
              />
              <span className="text-sm">{pref}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div className="space-y-2 pt-3 border-t">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.termsAccepted}
            onChange={(e) => updateField("termsAccepted", e.target.checked)}
          />
          <span className="text-sm">I agree to the Terms & Conditions</span>
        </label>
        {errors.termsAccepted && (
          <p className="text-red-500 text-sm">{errors.termsAccepted}</p>
        )}

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.privacyAccepted}
            onChange={(e) => updateField("privacyAccepted", e.target.checked)}
          />
          <span className="text-sm">
            I agree to the Privacy Policy and data usage terms
          </span>
        </label>

        {errors.privacyAccepted && (
          <p className="text-red-500 text-sm">{errors.privacyAccepted}</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setStep(3)}
          className="flex items-center"
        >
          <ChevronLeft size={16} className="mr-2" />
          Back
        </Button>

        <Button
          onClick={handleRegister}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 cursor-pointer"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
    </div>
  );
}

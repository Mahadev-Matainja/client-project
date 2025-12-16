// Step2Account.tsx
"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import FormHeader from "./FormHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store";
import { updateAccount } from "@/lib/slices/signupSlice";
import { ChevronLeft, Eye, EyeOff, Lock } from "lucide-react";
import { validateAccount } from "../utils/validation";

export default function Step2Account({
  step,
  setStep,
}: {
  step: number;
  setStep: (n: number) => void;
}) {
  const dispatch = useDispatch();
  const acct = useSelector((s: RootState) => s.signup.patient.account);

  const [form, setForm] = React.useState({
    password: acct.password || "",
    confirmPassword: acct.confirmPassword || "",
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [errors, setErrors] = React.useState<any>({});

  //   function onNext() {
  //     dispatch(updateAccount(form));
  //     setStep(3); // go to Step 3 without validation
  //   }

  function onNext() {
    const err = validateAccount(form);
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    dispatch(updateAccount(form));
    setStep(3);
  }

  return (
    <div className="space-y-6">
      {/* Password */}
      <div className="space-y-2">
        <Label>
          Password <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type={showPassword ? "text" : "password"}
            className="pl-10 pr-10"
            placeholder="Create a password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password}</p>
        )}
        <div className="text-xs text-gray-500 space-y-1">
          <p>Password must contain:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>At least 8 characters</li>
            <li>One uppercase letter</li>
            <li>One lowercase letter</li>
            <li>One number</li>
          </ul>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label>
          Confirm Password <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type={showConfirm ? "text" : "password"}
            className="pl-10 pr-10"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showConfirm ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep(1)}>
          <ChevronLeft size={16} className="mr-2" />
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}

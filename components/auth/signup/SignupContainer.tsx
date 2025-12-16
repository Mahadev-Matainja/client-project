"use client";
import React from "react";
import Step1Personal from "./components/Step1Personal";
import Step2Account from "./components/Step2Account";
import Step3Health from "./components/Step3Health";
import Step4Goal from "./components/Step4Goal";
import SingleStepForm from "./components/SingleStepForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import FormHeader from "./components/FormHeader";
import { Label } from "@/components/ui/label";

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onClose: () => void;
}

export default function SignupContainer({
  onSwitchToSignIn,
  onClose,
}: SignUpFormProps) {
  const [step, setStep] = React.useState(1);
  const [role, setRole] = React.useState<
    | "patient"
    | "oxygen"
    | "ambulance"
    | "clinic"
    | "doctor"
    | "dietitian"
    | "sample_collector"
    | "physiotherapist"
  >("patient");

  // patient has 4 steps, others single step
  const totalSteps = role === "patient" ? 4 : 1;
  const currentStep = role === "patient" ? step : 1;

  // progress only for patient
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-6">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center">Create your account</h1>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% Completed</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step indicators */}
        <div className="flex justify-center space-x-2 mt-4">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            return (
              <div
                key={stepNumber}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  stepNumber < currentStep
                    ? "bg-green-500 text-white"
                    : stepNumber === currentStep
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {stepNumber < currentStep ? (
                  <CheckCircle size={16} />
                ) : (
                  stepNumber
                )}
              </div>
            );
          })}
        </div>

        {/* 🔥 YOUR FORM HEADER GOES HERE */}
        <div className="text-center mb-2">
          <FormHeader
            step={role === "patient" ? currentStep : undefined}
            type={role}
          />
        </div>

        {/* 🔥 User Type Selector (under Form Header) */}
        {currentStep === 1 && (
          <>
            {/* 🔥 User Type Selector (only step 1) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Service Type <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-4 gap-6 pt-4 pb-4 border-b-2 border-b-gray-300">
                {(
                  [
                    "patient",
                    "oxygen",
                    "ambulance",
                    "clinic",
                    "doctor",
                    "dietitian",
                    "sample_collector",
                    "physiotherapist",
                  ] as const
                ).map((r) => (
                  <label
                    key={r}
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => {
                      setRole(r);
                      setStep(1); // reset form step when role changes
                    }}
                  >
                    <input
                      type="radio"
                      name="userType"
                      checked={role === r}
                      onChange={() => {}}
                      className="h-4 w-4 text-blue-600 text-sm"
                    />
                    <span className="capitalize text-gray-700 font-medium text-sm">
                      {r}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step Fields Start */}
        {role === "patient" && (
          <>
            {currentStep === 1 && (
              <Step1Personal step={currentStep} setStep={setStep} />
            )}
            {currentStep === 2 && (
              <Step2Account step={currentStep} setStep={setStep} />
            )}
            {currentStep === 3 && (
              <Step3Health step={currentStep} setStep={setStep} />
            )}
            {currentStep === 4 && (
              <Step4Goal step={currentStep} setStep={setStep} />
            )}
          </>
        )}

        {role !== "patient" && <SingleStepForm role={role} />}

        <div className="text-center text-sm text-gray-600 pt-4 border-t">
          Already have an account?{" "}
          <button
            onClick={onSwitchToSignIn}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign In
          </button>
        </div>
      </Card>
    </div>
  );
}

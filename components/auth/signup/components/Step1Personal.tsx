"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store";
import { updatePersonal } from "@/lib/slices/signupSlice";
import { Calendar, Mail } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validatePersonal } from "../utils/validation";
import { checkUnique } from "../utils/uniqueCheck";

type Step1PersonalProps = {
  step: number;
  setStep: (step: number) => void;
};

export default function Step1Personal({ setStep }: Step1PersonalProps) {
  const dispatch = useDispatch();
  const stored = useSelector((s: RootState) => s.signup.patient.personal);

  const [form, setForm] = React.useState({
    firstName: stored.firstName || "",
    lastName: stored.lastName || "",
    email: stored.email || "",
    dob: stored.dob || "",
    mobile: stored.mobile || "",
    gender: stored.gender || "male",
  });
  const [enable, setEnable] = useState<boolean>(true);

  const [errors, setErrors] = React.useState<any>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function onNext() {
    const err = validatePersonal(form);

    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }
    dispatch(updatePersonal(form));
    setStep(2);
  }

  //unique check
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (form.email || form.mobile) {
        const result = await checkUnique(form.email, form.mobile);

        // update errors
        setErrors((prev: any) => ({
          ...prev,
          ...(form.email && !result.emailAvailable
            ? { email: result.emailMessage || "Email already registered" }
            : {}),
          ...(form.mobile && !result.mobileAvailable
            ? { mobile: result.mobileMessage || "Mobile already registered" }
            : {}),
        }));

        // update enable state
        if (result.emailAvailable && result.mobileAvailable) {
          setEnable(false);
          setErrors({});
        } else {
          setEnable(true);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.email, form.mobile]);

  return (
    <div className="space-y-6">
      {/* FIRST + LAST NAME */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Arun"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Das"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* EMAIL */}
      <div className="space-y-2">
        <Label>
          Email <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="arundas@gmail.com"
            className="pl-10"
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      {/* DOB */}
      <div className="space-y-2">
        <Label>
          Date of Birth <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            name="dob"
            type="date"
            value={form.dob}
            max={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            className="pl-10"
          />
        </div>
        {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
      </div>

      {/* MOBILE */}
      <div className="space-y-2">
        <Label>
          Mobile Number <span className="text-red-500">*</span>
        </Label>
        <div className="flex">
          <span className="flex items-center justify-center bg-gray-200 text-gray-700 px-3 rounded-l-md border">
            +91
          </span>
          <Input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            maxLength={10}
            placeholder="1234567890"
            className="rounded-l-none"
          />
        </div>
        {errors.mobile && (
          <p className="text-red-500 text-sm">{errors.mobile}</p>
        )}
      </div>

      {/* GENDER */}
      <div className="space-y-2 w-2/5">
        <Label>Gender</Label>
        <Select
          value={form.gender}
          onValueChange={(val) => setForm((s) => ({ ...s, gender: val }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && (
          <p className="text-red-500 text-sm">{errors.gender}</p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={onNext} disabled={enable}>
          Next
        </Button>
      </div>
    </div>
  );
}

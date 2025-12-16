"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { resetSignup, updateSingleStep } from "@/lib/slices/signupSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getSession, signIn } from "next-auth/react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { validateSingleStep } from "../utils/validation";
import { checkUnique } from "../utils/uniqueCheck";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/utils/api";
import { setAuth } from "@/lib/slices/authSlice";

export default function SingleStepForm({
  role,
}: {
  role:
    | "oxygen"
    | "ambulance"
    | "clinic"
    | "doctor"
    | "dietitian"
    | "sample_collector"
    | "physiotherapist";
}) {
  const dispatch = useDispatch();
  const stored = useSelector((s: RootState) => s.signup.singleStep || {});
  const router = useRouter();
  const pathname = usePathname();

  const [form, setForm] = useState({
    name: stored.name || "",
    fname: stored.fname || "",
    lname: stored.lname || "",
    email: stored.email || "",
    mobile: stored.mobile || "",
    gender: stored.gender || "male",
    specialist: stored.specialist || "",
    category_id: stored.category_id || "",
    password: stored.password || "",
    confirm: stored.confirm || "",
    terms: stored.terms || false,
    policy: stored.policy || false,
  });

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [enable, setEnable] = useState<boolean>(true);
  const [divideName, setDivideName] = useState<boolean>(false);
  const [specialistOptions, setSpecialistOptions] = useState<any[]>([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/doctor/categories`);
        setSpecialistOptions(response.data.data || []);
      } catch (error) {
        console.error("Error fetching specialist options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (
      role === "doctor" ||
      role === "dietitian" ||
      role === "sample_collector" ||
      role === "physiotherapist"
    ) {
      setDivideName(true);
      fetchData();
    } else {
      setDivideName(false);
    }
  }, [role]);

  //unique check
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (form.email || form.mobile) {
        const result = await checkUnique(form.email, form.mobile, role);

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
  }, [form.email, form.mobile, role]);

  //api error
  const showApiError = (data: any) => {
    if (data.errors) {
      const errorMessages = Object.entries(data.errors)
        .map(([field, messages]) => {
          const fieldName = field
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
          if (Array.isArray(messages)) {
            return `${fieldName}: ${messages.join(", ")}`;
          }
          return `${fieldName}: ${messages}`;
        })
        .join(". ");

      toast({
        variant: "destructive",
        title: data.message || "Validation Failed",
        description: errorMessages,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: data.message || "Something went wrong",
      });
    }
  };

  async function submit() {
    const validationErrors = validateSingleStep(form, role);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(updateSingleStep({ ...form, role }));

    const payload = {
      role,
      ...form,
      mobile_no: form.mobile,
      category_id: form.category_id,
      confirmPassword: form.confirm,
      gender: form.gender,
      termsAccepted: form.terms,
      privacyAccepted: form.policy,
    };

    setIsLoading(true);

    const end_point =
      role === "doctor" ||
      role === "dietitian" ||
      role === "sample_collector" ||
      role === "physiotherapist"
        ? "/auth/doctor/signup"
        : `/auth/signup`;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${end_point}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      // Check if the API call was NOT successful
      if (!response.ok || !data.success) {
        // Show API error messages
        showApiError(data);
        return; // Stop execution here
      }

      // If we get here, the API call was successful
      toast({
        title: "Registration Successful 🎉",
        description: "Account created successfully",
      });

      // Auto-login
      await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        role: data.data.user.type,
        redirect: false,
      });

      const session = await getSession();
      const customer = session?.user?.data?.customer;
      const token = session?.user?.data?.token;
      const userRole = customer?.type; // Renamed to avoid conflict with outer scope
      const subType = customer?.subType;
      const permissions = customer?.permissions || [];

      if (customer && token) {
        dispatch(
          setAuth({
            user: {
              ...customer,
              avatar: customer.avatar ?? undefined,
              role: userRole,
              subType,
              permissions,
            },
            token,
          })
        );
      }

      toast({ title: "Login successful ✅" });

      if (pathname.startsWith("/doctor"))
        sessionStorage.setItem("doctorLogin", "true");

      if (
        userRole === "doctor" ||
        userRole === "dietitian" ||
        userRole === "sample_collector" ||
        userRole === "physiotherapist"
      ) {
        router.push("/doctor/dashboard");
      } else if (userRole === "customer" && subType === "ambulance") {
        router.push("/ambulance/dashboard");
      } else if (userRole === "customer" && subType === "oxygen") {
        router.push("/oxygen/dashboard");
      } else if (userRole === "customer" && subType === "clinic") {
        router.push("/clinic/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Network Error",
        description:
          "Failed to connect to server. Please check your internet connection.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Name */}{" "}
      {divideName ? (
        <div className="grid md:grid-cols-2 gap-4">
          {" "}
          <div className="space-y-2">
            <Label>
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.fname}
              placeholder="Subir"
              onChange={(e) => setForm({ ...form, fname: e.target.value })}
            />
            {errors.fname && (
              <p className="text-red-500 text-sm">{errors.fname}</p>
            )}{" "}
          </div>
          <div className="space-y-2">
            <Label>
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.lname}
              placeholder="Das"
              onChange={(e) => setForm({ ...form, lname: e.target.value })}
            />
            {errors.lname && (
              <p className="text-red-500 text-sm">{errors.lname}</p>
            )}{" "}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {" "}
          <Label>
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            value={form.name}
            placeholder="Enter Provider Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}{" "}
        </div>
      )}
      {/* Email */}
      <div className="space-y-2">
        <Label>
          Email <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="email"
            className="pl-10"
            placeholder="abc@gmail.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>
      {/* Mobile */}
      <div className="space-y-2">
        <Label>
          Mobile Number <span className="text-red-500">*</span>
        </Label>
        <div className="flex">
          <span className="flex items-center justify-center bg-gray-200 text-gray-700 px-3 rounded-l-md border border-r-0 border-gray-300 text-sm">
            +91
          </span>
          <Input
            type="tel"
            maxLength={10}
            className="rounded-l-none"
            placeholder="1234567890"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />
        </div>
        {errors.mobile && (
          <p className="text-red-500 text-sm">{errors.mobile}</p>
        )}
      </div>
      {divideName && (
        <div className="grid md:grid-cols-2">
          {/* GENDER */}
          <div className="space-y-2">
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

          {/* Specialist */}
          <div className="space-y-2">
            <Label>
              Specialist <span className="text-red-500">*</span>
            </Label>
            <div>
              <Select
                value={form.category_id} // or form.specialistId, whatever you store
                onValueChange={(id: string) => {
                  const selected = specialistOptions.find(
                    (opt) => opt.id === id
                  );

                  setForm((s) => ({
                    ...s,
                    category_id: id,
                    specialist: selected?.name ?? "", // keep name in state too if needed
                  }));
                }}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Specialist" />
                </SelectTrigger>

                <SelectContent>
                  {specialistOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.specialist && (
              <p className="text-red-500 text-sm">{errors.specialist}</p>
            )}
          </div>
        </div>
      )}
      {/* Password */}
      <div className="space-y-2">
        <Label>
          Password <span className="text-red-500">*</span>
        </Label>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="pr-10"
          />

          {/* Eye Icon */}
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>

        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>
      {/* Confirm Password */}
      <div className="space-y-2">
        <Label>
          Confirm Password <span className="text-red-500">*</span>
        </Label>

        <div className="relative">
          <Input
            type={showConfirm ? "text" : "password"}
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className="pr-10"
          />

          {/* Eye Icon */}
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>

        {errors.confirm && (
          <p className="text-red-500 text-sm">{errors.confirm}</p>
        )}
      </div>
      {/* Terms & Policy */}
      <div className="space-y-3 pt-3 border-t">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={form.terms}
            onCheckedChange={(val: any) => setForm({ ...form, terms: val })}
          />
          <Label>I agree to Terms & Conditions</Label>
        </div>
        {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={form.policy}
            onCheckedChange={(val: any) => setForm({ ...form, policy: val })}
          />
          <Label>I agree to the Privacy Policy and data usage terms</Label>
        </div>
        {errors.policy && (
          <p className="text-red-500 text-sm">{errors.policy}</p>
        )}
      </div>
      {/* Submit Button */}
      <div className="flex justify-center mt-8">
        <Button
          className="w-1/2 bg-green-600 hover:bg-green-700 cursor-pointer"
          onClick={submit}
          disabled={isLoading || enable}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
    </div>
  );
}

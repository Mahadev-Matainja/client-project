"use client";
import React, { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { setAuth } from "@/lib/slices/authSlice";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Eye, EyeOff, AlertCircle, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onClose: () => void;
}
export default function SignInForm({
  onSwitchToSignUp,
  onClose,
}: SignInFormProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "customer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [authError, setAuthError] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (authError) setAuthError("");
  };
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.role) newErrors.role = "User type is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setAuthError("");
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        redirect: false,
      });
      if (result?.error) {
        setAuthError("Invalid email or password");
        return;
      }
      const session = await getSession();
      const customer = session?.user?.data?.customer;
      const token = session?.user?.data?.token;
      const role = customer?.type;
      const subType = customer?.subType;
      const permissions = customer?.permissions || [];
      console.log(permissions);
      if (customer && token) {
        dispatch(
          setAuth({
            user: {
              ...customer,
              avatar: customer.avatar ?? undefined,
              role,
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
        role === "doctor" ||
        role === "dietitian" ||
        role === "sample_collector" ||
        role === "physiotherapist"
      ) {
        router.push("/doctor/dashboard");
      } else if (role === "customer" && subType === "ambulance") {
        router.push("/ambulance/dashboard");
      } else if (role === "customer" && subType === "oxygen") {
        router.push("/oxygen/dashboard");
      } else if (role === "customer" && subType === "clinic") {
        router.push("/clinic/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setAuthError("An unexpected error occurred");
      toast({
        title: "Login failed ❌",
        description: "Something went wrong while logging in.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setAuthError("");
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: window.location.origin,
      });
      if (result?.error) setAuthError("Google sign in failed");
      else onClose();
    } catch {
      setAuthError("Google sign in failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };
  return (
    <div
      className={`${
        !pathname.startsWith("/doctor") && "bg-black/50"
      } fixed inset-0 flex items-center justify-center z-50 p-4`}
    >
      <Card className="w-full max-w-md relative">
        {!pathname.startsWith("/doctor") && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome Back
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {authError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* <div className="space-y-2 w-full">
              <Label>User Type</Label>
              <Select
                value={formData.role}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, role: val }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="ambulance">Ambulance Provider</SelectItem>
                  <SelectItem value="oxygen">Oxygen Provider</SelectItem>
                  <SelectItem value="clinic">Clinic</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                </SelectContent>
              </Select>

              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role}</p>
              )}
            </div> */}
            {/* User Role */}
            <div className="space-y-2">
              <Label>Log-in as</Label>

              <div className="flex items-center gap-4 ">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={formData.role === "customer"}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, role: "customer" }))
                    }
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Customer</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="doctor"
                    checked={formData.role === "doctor"}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, role: "doctor" }))
                    }
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Doctor</span>
                </label>
              </div>

              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role}</p>
              )}
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />{" "}
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />{" "}
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10 pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  disabled={isLoading || isGoogleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={isLoading || isGoogleLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="text-center text-sm text-gray-600">
            Don't have an account?
            <button
              onClick={onSwitchToSignUp}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Create Account
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

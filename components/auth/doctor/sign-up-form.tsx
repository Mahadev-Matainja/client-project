"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { setAuth } from "@/lib/slices/authSlice";

import {
  User,
  Mail,
  Lock,
  Calendar,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  Shield,
  Heart,
  CheckCircle,
  Chrome,
  AlertCircle,
  Phone,
} from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";
import api from "@/utils/api";
import { mapApiUserToState } from "@/utils/userMapper";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onClose: () => void;
}

interface FormData {
  // Step 1: Basic Info
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  mobile_no: string;
  gender: string;

  // Step 2: Security
  password: string;
  confirmPassword: string;

  // Step 3: Health Information
  hasChronicDiseases: string;
  chronicDiseases: string[];
  currentMedications: string;
  allergies: string;
  emergencyContact: string;
  emergencyPhone: string;

  // Step 4: Preferences
  healthGoals: string[];
  communicationPreferences: string[];
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

const chronicDiseaseOptions = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Asthma",
  "Arthritis",
  "Cancer",
  "Kidney Disease",
  "Liver Disease",
  "Thyroid Disorders",
  "Mental Health Conditions",
  "Neurological Disorders",
  "Other",
];

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

export default function SignUpForm({
  onSwitchToSignIn,
  onClose,
}: SignUpFormProps) {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [authError, setAuthError] = useState("");
  const [checking, setChecking] = useState(false);

  const [emailStatus, setEmailStatus] = useState<null | "valid" | "invalid">(
    null
  );
  const [emailMsg, setEmailMsg] = useState("");

  const [mobileStatus, setMobileStatus] = useState<null | "valid" | "invalid">(
    null
  );
  const [mobileMsg, setMobileMsg] = useState("");

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    mobile_no: "",
    gender: "male",
    password: "",
    confirmPassword: "",
    hasChronicDiseases: "",
    chronicDiseases: [],
    currentMedications: "",
    allergies: "",
    emergencyContact: "",
    emergencyPhone: "",
    healthGoals: [],
    communicationPreferences: [],
    termsAccepted: false,
    privacyAccepted: false,
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMultiSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const currentArray = prev[name as keyof FormData] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];

      return { ...prev, [name]: newArray };
    });
  };

  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim())
          newErrors.firstName = "First name is required";
        if (!formData.lastName.trim())
          newErrors.lastName = "Last name is required";

        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address";
        } else if (emailStatus === "invalid") {
          newErrors.email = emailMsg || "This email is already registered";
        }

        if (!formData.mobile_no.trim()) {
          newErrors.mobile_no = "Mobile number is required";
        } else if (!/^\d+$/.test(formData.mobile_no.trim())) {
          newErrors.mobile_no = "Mobile number must contain only digits";
        } else if (formData.mobile_no.trim().length !== 10) {
          newErrors.mobile_no = "Mobile number must be exactly 10 digits";
        } else if (mobileStatus === "invalid") {
          newErrors.mobile_no =
            mobileMsg || "This mobile number is already registered";
        } else {
        }

        if (!formData.dateOfBirth)
          newErrors.dateOfBirth = "Date of birth is required";
        if (!formData.gender) newErrors.gender = "Gender is required";

        break;

      case 2:
        if (!formData.password) {
          newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          newErrors.password =
            "Password must contain uppercase, lowercase, and number";
        }

        if (!formData.confirmPassword) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
        break;

      case 3:
        if (!formData.hasChronicDiseases) {
          newErrors.hasChronicDiseases =
            "Please indicate if you have chronic diseases";
        }
        if (
          formData.hasChronicDiseases === "yes" &&
          formData.chronicDiseases.length === 0
        ) {
          newErrors.chronicDiseases = "Please select at least one condition";
        }
        if (!formData.emergencyContact.trim()) {
          newErrors.emergencyContact = "Emergency contact name is required";
        }
        if (!formData.emergencyPhone.trim()) {
          newErrors.emergencyPhone = "Emergency contact phone is required";
        }

        break;

      case 4:
        if (!formData.termsAccepted) {
          newErrors.termsAccepted = "You must accept the terms and conditions";
        }
        if (!formData.privacyAccepted) {
          newErrors.privacyAccepted = "You must accept the privacy policy";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    setAuthError("");

    try {
      const endpoints = pathname.startsWith("/doctor")
        ? "doctor/signup"
        : "signup";

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/${endpoints}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        let errorMessage = data.message || "Registration failed";

        // Handle validation errors
        if (data.errors) {
          const validationErrors = (Object.values(data.errors) as string[][])
            .flat()
            .map((err) => `• ${err}`)
            .join("\n");

          errorMessage += `\n${validationErrors}`;
        }

        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: errorMessage,
        });

        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data?.data?.customer) {
        // ✅ Dispatch to Redux
        const { customer, token } = data.data;
        dispatch(setAuth({ user: customer, token }));
      }

      // Close modal
      // onClose();

      // ✅ Success toast
      toast({
        title: "Registration Successful 🎉",
      });

      // ✅ Auto-login with NextAuth
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: true,
        callbackUrl: "/dashboard",
      });

      console.log(formData.email);
      console.log(formData.password);
    } catch (error: any) {
      console.error("Registration error:", error);
      setAuthError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h3>
              <p className="text-sm text-gray-600">
                Let's start with your basic details
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Arun"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Das"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="arundas@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({ ...prev, email: value }));

                    // 👇 clear "Email is required" once user starts typing
                    if (value.trim() !== "") {
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                  className={`pl-10 ${
                    errors.email
                      ? "border-red-500"
                      : emailStatus === "valid"
                      ? "border-green-500"
                      : emailStatus === "invalid"
                      ? "border-red-500"
                      : ""
                  }`}
                />

                {emailStatus === "valid" && !checking && (
                  <span className="absolute right-3 top-2 text-green-600">
                    ✔
                  </span>
                )}

                {emailStatus === "invalid" && !checking && (
                  <span className="absolute right-3 top-2 text-red-600">✖</span>
                )}
              </div>

              {errors.email && (
                <p className="text-sm mt-1 text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`pl-10 ${
                    errors.dateOfBirth ? "border-red-500" : ""
                  }`}
                  max={
                    new Date(Date.now() - 86400000).toISOString().split("T")[0]
                  }
                  // disallow today & future
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile_no">Mobile Number:</Label>
              <div className="relative">
                {/* Left-side +91 */}
                <span className="absolute left-3 top-1.5 text-gray-500">
                  +91
                </span>

                <Input
                  id="mobile_no"
                  name="mobile_no"
                  maxLength={10}
                  type="tel"
                  placeholder="123-456-7890"
                  value={formData.mobile_no}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData((prev: any) => ({
                      ...prev,
                      mobile_no: value,
                    }));
                  }}
                  className={`pl-12 ${
                    errors.mobile_no
                      ? "border-red-500"
                      : mobileStatus === "valid"
                      ? "border-green-500"
                      : mobileStatus === "invalid"
                      ? "border-red-500"
                      : ""
                  }`}
                />

                {/* Validation icons */}
                {mobileStatus === "valid" && !checking && (
                  <span className="absolute right-3 top-2 text-green-600">
                    ✔
                  </span>
                )}
                {mobileStatus === "invalid" && !checking && (
                  <span className="absolute right-3 top-2 text-red-600">✖</span>
                )}
              </div>

              {/* Validation message */}
              {errors.mobile_no && (
                <p className="text-sm mt-1 text-red-500">{errors.mobile_no}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger
                  className={errors.gender ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Account Security
              </h3>
              <p className="text-sm text-gray-600">
                Create a secure password for your account
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  className={`pl-10 pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  className={`pl-10 pr-10 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Health Information
              </h3>
              <p className="text-sm text-gray-600">
                Help us provide better care by sharing your health details
              </p>
            </div>

            <div className="space-y-2">
              <Label>
                Do you have any chronic diseases or ongoing health conditions?
              </Label>
              <Select
                value={formData.hasChronicDiseases}
                onValueChange={(value) =>
                  handleSelectChange("hasChronicDiseases", value)
                }
              >
                <SelectTrigger
                  className={errors.hasChronicDiseases ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">
                    Yes, I have chronic conditions
                  </SelectItem>
                  <SelectItem value="no">No, I don't have any</SelectItem>
                </SelectContent>
              </Select>
              {errors.hasChronicDiseases && (
                <p className="text-sm text-red-500">
                  {errors.hasChronicDiseases}
                </p>
              )}
            </div>

            {formData.hasChronicDiseases === "yes" && (
              <div className="space-y-2">
                <Label>
                  Please select your conditions (check all that apply):
                </Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {chronicDiseaseOptions.map((disease) => (
                    <label
                      key={disease}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={formData.chronicDiseases.includes(disease)}
                        onChange={() =>
                          handleMultiSelectChange("chronicDiseases", disease)
                        }
                        className="rounded border-gray-300"
                      />
                      <span>{disease}</span>
                    </label>
                  ))}
                </div>
                {errors.chronicDiseases && (
                  <p className="text-sm text-red-500">
                    {errors.chronicDiseases}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentMedications">
                Current Medications (Optional)
              </Label>
              <Textarea
                id="currentMedications"
                name="currentMedications"
                placeholder="List any medications you're currently taking..."
                value={formData.currentMedications}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Known Allergies (Optional)</Label>
              <Textarea
                id="allergies"
                name="allergies"
                placeholder="List any known allergies (medications, food, environmental)..."
                value={formData.allergies}
                onChange={handleInputChange}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  placeholder="Full name"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className={errors.emergencyContact ? "border-red-500" : ""}
                />
                {errors.emergencyContact && (
                  <p className="text-sm text-red-500">
                    {errors.emergencyContact}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                <div className="relative">
                  {/* Prefix */}
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    +91
                  </span>
                  <Input
                    id="emergencyPhone"
                    name="emergencyPhone"
                    placeholder="Phone number"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    className={`pl-12 ${
                      errors.emergencyPhone ? "border-red-500" : ""
                    }`}
                  />
                </div>

                {errors.emergencyPhone && (
                  <p className="text-sm text-red-500">
                    {errors.emergencyPhone}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <UserCheck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Health Goals & Preferences
              </h3>
              <p className="text-sm text-gray-600">
                Customize your healthcare experience
              </p>
            </div>

            <div className="space-y-2">
              <Label>
                What are your primary health goals? (Select all that apply)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {healthGoalOptions.map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={goal}
                      checked={formData.healthGoals.includes(goal)}
                      onChange={() =>
                        handleMultiSelectChange("healthGoals", goal)
                      }
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={goal} className="text-sm font-normal">
                      {goal}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>How would you like to receive health updates?</Label>
              <div className="space-y-2">
                {[
                  "Email notifications",
                  "SMS alerts",
                  "Push notifications",
                  "Monthly reports",
                ].map((pref) => (
                  <div key={pref} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={pref}
                      checked={formData.communicationPreferences.includes(pref)}
                      onChange={() =>
                        handleMultiSelectChange(
                          "communicationPreferences",
                          pref
                        )
                      }
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={pref} className="text-sm font-normal">
                      {pref}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 mt-1"
                  />
                  <Label htmlFor="termsAccepted" className="text-sm">
                    I agree to the{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Terms and Conditions
                    </button>
                  </Label>
                </div>
                {errors.termsAccepted && (
                  <p className="text-sm text-red-500">{errors.termsAccepted}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="privacyAccepted"
                    name="privacyAccepted"
                    checked={formData.privacyAccepted}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 mt-1"
                  />
                  <Label htmlFor="privacyAccepted" className="text-sm">
                    I agree to the{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Privacy Policy
                    </button>{" "}
                    and consent to the processing of my health data
                  </Label>
                </div>
                {errors.privacyAccepted && (
                  <p className="text-sm text-red-500">
                    {errors.privacyAccepted}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  //email validation for unique check

  const isValidEmailFormat = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    if (!formData.email && !formData.mobile_no) {
      setEmailStatus(null);
      setMobileStatus(null);
      setErrors((prev) => ({
        ...prev,
        email: "",
        mobile_no: "",
      }));
      return;
    }

    const delay = setTimeout(() => {
      // invalid email format
      if (formData.email && !isValidEmailFormat(formData.email)) {
        setEmailStatus(null);
        setErrors((prev) => ({
          ...prev,
          email: "Please enter a valid email address",
        }));
        return;
      }

      // clear format errors before checking unique
      if (formData.email) {
        setErrors((prev) => ({ ...prev, email: "" }));
      }

      checkUnique(formData.email, formData.mobile_no);
    }, 600);

    return () => clearTimeout(delay);
  }, [formData.email, formData.mobile_no]);

  const checkUnique = async (email: string, mobile: string) => {
    try {
      setChecking(true);
      const res = await api.get(`/unique/check`, {
        params: { email, mobile_no: mobile },
      });

      const data = res.data;

      // Email check
      if (email) {
        if (data.email.available) {
          setEmailStatus("valid");
          setErrors((prev) => ({ ...prev, email: "" }));
        } else {
          setEmailStatus("invalid");
          setErrors((prev) => ({
            ...prev,
            email: data.email.message || "This email is already taken",
          }));
        }
      }

      // Mobile check
      if (mobile) {
        if (data.mobile_no.available) {
          setMobileStatus("valid");
          setErrors((prev) => ({ ...prev, mobile_no: "" }));
        } else {
          setMobileStatus("invalid");
          setErrors((prev) => ({
            ...prev,
            mobile_no:
              data.mobile_no.message || "This mobile number is already taken",
          }));
        }
      }
    } catch (err) {
      console.error("Validation error:", err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div
      className={`${
        !pathname.startsWith("/doctor") && "bg-black/50"
      } fixed inset-0 flex items-center justify-center z-50 p-4`}
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Create Your Account
          </CardTitle>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-2 mt-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  step < currentStep
                    ? "bg-green-500 text-white"
                    : step === currentStep
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  step
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Alert */}
          {authError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError} </AlertDescription>
            </Alert>
          )}

          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center bg-transparent"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 flex items-center"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            )}
          </div>

          <div className="text-center text-sm text-gray-600 pt-4 border-t">
            Already have an account?{" "}
            <button
              onClick={onSwitchToSignIn}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign In
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

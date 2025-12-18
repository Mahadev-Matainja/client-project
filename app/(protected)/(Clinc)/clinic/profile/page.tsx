"use client";

import React, { useEffect, useRef, useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Crown, Edit, Save, Star, Shield, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import api from "@/utils/api";
import { useDispatch } from "react-redux";
import { setAuthUpdate } from "@/lib/slices/authSlice";
import ProfileSkeleton from "@/components/ProfileSkeleton";
import LocationPickerMap from "@/components/LocationPickerMap";

// ------------ TYPES ------------
interface PersonalInfo {
  firstName: string;
  email: string;
  address: string;
  alt_no: string;
  avatar: string;
  phone: string;
  provider_id: string;
  pincode: string;
  registrationNumber: string;
  latitude?: number;
  longitude?: number;
}

interface Notifications {
  email: boolean;
  sms: boolean;
  push: boolean;
}

interface Privacy {
  shareWithDoctors: boolean;
  anonymousData: boolean;
}

interface Errors {
  firstName: string;
  address: string;
  pincode: string;
  registrationNumber: string;
}

interface LocationData {
  lat: number;
  lng: number;
  pincode: string;
  address: string;
}

// ------------ DEFAULT STATES ------------
const defaultPersonalInfo: PersonalInfo = {
  firstName: "",
  email: "",
  address: "",
  alt_no: "",
  avatar: "",
  phone: "",
  provider_id: "",
  pincode: "",
  registrationNumber: "",
  latitude: 22.5726,
  longitude: 88.3639,
};

const defaultNotifications: Notifications = {
  email: false,
  sms: false,
  push: false,
};

const defaultPrivacy: Privacy = {
  shareWithDoctors: false,
  anonymousData: false,
};

// ------------ COMPONENT ------------
const ProfileSettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [personalInfo, setPersonalInfo] =
    useState<PersonalInfo>(defaultPersonalInfo);
  const [notifications, setNotifications] =
    useState<Notifications>(defaultNotifications);
  const [privacy, setPrivacy] = useState<Privacy>(defaultPrivacy);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Errors>({
    firstName: "",
    address: "",
    pincode: "",
    registrationNumber: "",
  });

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace("/api", "") || "";

  // ------------ FETCH PROFILE DATA ------------
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/clinic/profile/show");

        if (!response.data.success) {
          toast({
            title: "Error",
            description: response.data.message,
            variant: "destructive",
          });
          return;
        }

        const data = response.data.data;
        const basic = data.basic_details || {};
        const personal = data.personal_information || {};

        // Set avatar URL
        setAvatarUrl(basic.avatar ? `${BASE_URL}/${basic.avatar}` : "");

        // Set personal info - ensure all string values are not undefined
        setPersonalInfo({
          firstName: basic.first_name || "",
          email: basic.email || "",
          phone: basic.phone || "",
          provider_id: basic.provider_id || "",
          avatar: basic.avatar || "",
          address: personal.address || "",
          alt_no: personal.alt_no || "",
          pincode: personal.pincode || "",
          registrationNumber: personal.registrationNumber || "",
          latitude: personal.latitude || 22.5726,
          longitude: personal.longitude || 88.3639,
        });

        // Set notifications
        setNotifications({
          email: data.notifications?.email || false,
          sms: data.notifications?.sms || false,
          push: data.notifications?.push || false,
        });

        // Set privacy
        setPrivacy({
          shareWithDoctors: data.privacy?.shareWithDoctors || false,
          anonymousData: data.privacy?.anonymousData || false,
        });
      } catch (err: any) {
        console.error("Fetch error:", err);
        toast({
          title: "Error",
          description: err.message || "Failed to fetch profile.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // ------------ HANDLE INPUTS ------------
  const handlePersonalInfoChange = (
    key: keyof PersonalInfo,
    value: string | number
  ) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [key]: value !== undefined && value !== null ? value.toString() : "",
    }));

    // Clear error when user types
    if (errors[key as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleNotificationChange = (
    key: keyof Notifications,
    value: boolean
  ) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: keyof Privacy, value: boolean) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
  };

  // ------------ HANDLE AVATAR UPLOAD ------------
  const handleCameraClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be under 10MB",
        variant: "destructive",
      });
      return;
    }

    setAvatarFile(file);
    setAvatarUrl(URL.createObjectURL(file));
  };

  // ------------ HANDLE LOCATION SELECT ------------

  const handleLocationSelect = (
    lat: number,
    lng: number,
    pincode: string,
    address: string
  ) => {
    setPersonalInfo((prev) => ({
      ...prev,
      address,
      pincode,
      latitude: lat,
      longitude: lng,
    }));

    if (errors.address || errors.pincode) {
      setErrors((prev) => ({
        ...prev,
        address: "",
        pincode: "",
      }));
    }
  };

  // ------------ VALIDATION ------------
  const validateForm = (): boolean => {
    const newErrors: Errors = {
      firstName: "",
      address: "",
      pincode: "",
      registrationNumber: "",
    };

    let isValid = true;

    if (!personalInfo.firstName.trim()) {
      newErrors.firstName = "First Name is required";
      isValid = false;
    }

    if (!personalInfo.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    if (!personalInfo.pincode || personalInfo.pincode.length !== 6) {
      newErrors.pincode = "Pin Code must be 6 digits";
      isValid = false;
    }

    if (!personalInfo.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration Number is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // ------------ SAVE ------------
  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();

      // Add all personal info fields (except avatar which is handled separately)
      Object.entries(personalInfo).forEach(([key, value]) => {
        if (key !== "avatar" && value !== undefined && value !== null) {
          // Convert to string for formData
          formData.append(key, value.toString());
        }
      });

      // Log form data before sending
      console.log("FormData contents:");
      formData.forEach((value, key) => {
        console.log(key, ":", value);
      });

      if (avatarFile) {
        formData.append("avatar", avatarFile);
        console.log("Avatar appended to formData");
      }

      const response = await api.post("/clinic/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Save response:", response.data); // Debug log

      if (response.data.success) {
        const updatedUser = response.data;
        const { customer, token } = updatedUser?.data || {};

        if (customer && token) {
          dispatch(setAuthUpdate({ user: customer, token }));
        }

        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        setIsEditing(false);

        // Reset avatar file after successful save
        setAvatarFile(null);
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (err: any) {
      console.error("Save error:", err);
      toast({
        title: "Error",
        description: err.message || "Update failed",
        variant: "destructive",
      });
    }
  };

  // ------------ RENDER ------------
  if (loading) {
    return (
      <MainLayout>
        <ProfileSkeleton />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-gray-600">Manage your personal details</p>
          </div>

          {isEditing ? (
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button className="gap-2" onClick={handleSave}>
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          ) : (
            <Button className="gap-2" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" /> Edit Profile
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl || "/noProfileImage.png"} />
                    <AvatarFallback>
                      {personalInfo.firstName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  {isEditing && (
                    <>
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                        onClick={handleCameraClick}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </>
                  )}
                </div>

                <h2 className="text-xl font-bold">
                  {personalInfo.firstName || "User"}
                </h2>
                <p className="text-gray-600">
                  {personalInfo.email || "No email"}
                </p>
                <p className="text-gray-600">
                  {personalInfo.phone || "No phone"}
                </p>

                <div className="flex justify-center gap-2 mt-3">
                  <Badge variant="outline">Verified</Badge>
                  <Badge variant="outline">
                    Clinic ID: {personalInfo.provider_id || "N/A"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* SUBSCRIPTION */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" /> Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Plan</span>
                  <Badge>Premium</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Next Billing</span>
                  <span>2025-02-15</span>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Star className="h-4 w-4" /> Upgrade Plan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* PERSONAL INFO */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" /> Personal Information
                </CardTitle>
                <CardDescription>Update your details</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* FIRST NAME */}
                  <div className="space-y-2">
                    <Label>
                      Clinic Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={personalInfo.firstName || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handlePersonalInfoChange("firstName", e.target.value)
                      }
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm">{errors.firstName}</p>
                    )}
                  </div>

                  {/* ALT NO */}
                  <div className="space-y-2">
                    <Label>Alternative Number</Label>
                    <div className="flex">
                      <span className="flex items-center justify-center bg-gray-200 text-gray-700 px-3 rounded-l-md border">
                        +91
                      </span>
                      <Input
                        value={personalInfo.alt_no || ""}
                        disabled={!isEditing}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          handlePersonalInfoChange("alt_no", value);
                        }}
                        placeholder="Enter 10-digit number"
                        className="rounded-l-none"
                      />
                    </div>
                    {personalInfo.alt_no &&
                      personalInfo.alt_no.length !== 10 && (
                        <p className="text-sm text-red-500">
                          Please enter exactly 10 digits
                        </p>
                      )}
                  </div>

                  {/* PINCODE */}
                  <div className="space-y-2">
                    <Label>
                      Pin Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={personalInfo.pincode || ""}
                      disabled={!isEditing}
                      inputMode="numeric"
                      maxLength={6}
                      onChange={(e) =>
                        handlePersonalInfoChange(
                          "pincode",
                          e.target.value.replace(/\D/g, "").slice(0, 6)
                        )
                      }
                      placeholder="Enter 6-digit pin code"
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-sm">{errors.pincode}</p>
                    )}
                  </div>

                  {/* REGISTRATION NUMBER */}
                  <div className="space-y-2">
                    <Label>
                      Registration Number{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={personalInfo.registrationNumber || ""}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handlePersonalInfoChange(
                          "registrationNumber",
                          e.target.value
                        )
                      }
                      placeholder="e.g. WBMC/2022/45678"
                    />
                    {errors.registrationNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.registrationNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="space-y-2">
                  <Label>
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    rows={2}
                    disabled={!isEditing}
                    value={personalInfo.address || ""}
                    onChange={(e) =>
                      handlePersonalInfoChange("address", e.target.value)
                    }
                    placeholder="Enter your address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address}</p>
                  )}
                </div>

                {/* LOCATION PICKER */}
                {isEditing && (
                  <div className="space-y-2">
                    <Label>Select Location on Map</Label>
                    <p className="text-sm text-gray-600">
                      Click on the map to automatically fill address and
                      pincode.
                    </p>
                    {/* Map - Using current location from form */}
                    <LocationPickerMap
                      lat={Number(personalInfo.latitude)}
                      lng={Number(personalInfo.longitude)}
                      height="180px"
                      onLocationSelect={handleLocationSelect}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* PRIVACY + NOTIFICATIONS */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" /> Privacy &
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* NOTIFICATIONS */}
                <div className="space-y-3">
                  <Label className="font-medium">Notifications</Label>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-600">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      disabled={!isEditing}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("email", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-600">
                        Urgent alerts via SMS
                      </p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      disabled={!isEditing}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("sms", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-600">Get app alerts</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      disabled={!isEditing}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("push", checked)
                      }
                    />
                  </div>
                </div>

                <Separator />

                {/* PRIVACY */}
                <div className="space-y-3">
                  <Label className="font-medium">Privacy</Label>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Share with Doctors</p>
                      <p className="text-sm text-gray-600">
                        Allow doctors to view your records
                      </p>
                    </div>
                    <Switch
                      checked={privacy.shareWithDoctors}
                      disabled={!isEditing}
                      onCheckedChange={(checked) =>
                        handlePrivacyChange("shareWithDoctors", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Anonymous Data Sharing</p>
                      <p className="text-sm text-gray-600">
                        Share anonymized health data
                      </p>
                    </div>
                    <Switch
                      checked={privacy.anonymousData}
                      disabled={!isEditing}
                      onCheckedChange={(checked) =>
                        handlePrivacyChange("anonymousData", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfileSettingsPage;

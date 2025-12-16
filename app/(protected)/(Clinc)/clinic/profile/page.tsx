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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import api from "@/utils/api";
import { useDispatch } from "react-redux";
import { setAuthUpdate } from "@/lib/slices/authSlice";
import ProfileSkeleton from "@/components/ProfileSkeleton";

// ------------ DEFAULT STATES ------------
const defaultPersonalInfo = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  alt_no: "",
  avatar: "",
  phone: "",
  provider_id: "",
};

const defaultNotifications = {
  email: false,
  sms: false,
  push: false,
};

const defaultPrivacy = {
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

  const [personalInfo, setPersonalInfo] = useState(defaultPersonalInfo);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [privacy, setPrivacy] = useState(defaultPrivacy);
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({
    firstName: "",
    address: "",
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

        // --- SET AVATAR ---
        setAvatarUrl(
          data.basic_details.avatar
            ? `${BASE_URL}/${data.basic_details.avatar}`
            : ""
        );

        // --- SET PERSONAL INFO ---
        setPersonalInfo({
          firstName: data.basic_details.first_name || "",
          lastName: data.basic_details.last_name || "",
          email: data.basic_details.email || "",
          phone: data.basic_details.phone || "",
          provider_id: data.basic_details.provider_id || "",
          avatar: data.basic_details.avatar || "",

          // API DOES NOT SEND THESE — give safe defaults
          address: data.personal_information.address || "",
          alt_no: data.personal_information.alt_no || "",
        });

        // --- SET NOTIFICATIONS ---
        setNotifications({
          email: data.notifications.email,
          sms: data.notifications.sms,
          push: data.notifications.push,
        });

        // --- SET PRIVACY ---
        setPrivacy({
          shareWithDoctors: data.privacy.shareWithDoctors,
          anonymousData: data.privacy.anonymousData,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch profile.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // ------------ HANDLE INPUTS ------------
  const handleInputChange = (
    section: "personalInfo" | "notifications" | "privacy",
    key: string,
    value: any
  ) => {
    if (section === "personalInfo")
      setPersonalInfo((prev) => ({ ...prev, [key]: value }));

    if (section === "notifications")
      setNotifications((prev) => ({ ...prev, [key]: value }));

    if (section === "privacy")
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

  // ------------ SAVE ------------
  const handleSave = async () => {
    const newErrors: any = {};

    if (!personalInfo.firstName.trim())
      newErrors.firstName = " First Name isRequired";
    if (!personalInfo.address.trim())
      newErrors.address = "  Address is Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Validation Error",
        description: "Required fields missing",
        variant: "destructive",
      });
      return;
    }

    setErrors({ firstName: "", address: "" });

    try {
      const formData = new FormData();

      const allowedFields = [
        "firstName",
        "lastName",
        "email",
        "address",
        "alt_no",
      ];

      allowedFields.forEach((key) => {
        formData.append(
          key,
          personalInfo[key as keyof typeof personalInfo] || ""
        );
      });

      if (avatarFile) formData.append("avatar", avatarFile);

      const response = await api.post("/clinic/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        const updatedUser = response.data;
        const { customer, token } = updatedUser?.data;
        dispatch(setAuthUpdate({ user: customer, token }));
        toast({
          title: "Success",
          description: "Profile updated",
        });
        setIsEditing(false);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Update failed",
        variant: "destructive",
      });
    }
  };

  // ------------ UI ------------
  return (
    <MainLayout>
      {loading ? (
        <ProfileSkeleton />
      ) : (
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
                        {personalInfo.firstName?.[0] || "U"}
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
                    {personalInfo.firstName} {personalInfo.lastName}
                  </h2>
                  <p>{personalInfo.email}</p>
                  <p>{personalInfo.phone}</p>

                  <div className="flex justify-center gap-2 mt-3">
                    <Badge variant="outline">Verified</Badge>
                    <Badge variant="outline">
                      Clinic ID: {personalInfo.provider_id}
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
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
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
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={personalInfo.firstName}
                        disabled={!isEditing}
                        onChange={(e) => {
                          setErrors({ ...errors, firstName: "" });
                          handleInputChange(
                            "personalInfo",
                            "firstName",
                            e.target.value
                          );
                        }}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    {/* LAST NAME */}
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                        value={personalInfo.lastName}
                        disabled={!isEditing}
                        onChange={(e) =>
                          handleInputChange(
                            "personalInfo",
                            "lastName",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* ALT NO */}
                    <div className="space-y-2">
                      <Label>Alternative Number</Label>
                      <div className="flex">
                        <span className="flex items-center justify-center bg-gray-200 text-gray-700 px-3 rounded-l-md border">
                          +91
                        </span>
                        <Input
                          value={personalInfo.alt_no}
                          disabled={!isEditing}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only numbers and limit to 10 digits
                            const numericValue = value
                              .replace(/\D/g, "")
                              .slice(0, 10);
                            handleInputChange(
                              "personalInfo",
                              "alt_no",
                              numericValue
                            );
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
                  </div>

                  {/* ADDRESS */}
                  <div className="space-y-2">
                    <Label>
                      Address <span className="text-red-500">*</span>
                    </Label>

                    <Textarea
                      rows={2}
                      disabled={!isEditing}
                      value={personalInfo.address}
                      onChange={(e) => {
                        setErrors({ ...errors, address: "" });
                        handleInputChange(
                          "personalInfo",
                          "address",
                          e.target.value
                        );
                      }}
                    />

                    {errors.address && (
                      <p className="text-red-500 text-sm">{errors.address}</p>
                    )}
                  </div>
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

                    {["email", "sms", "push"].map((key) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">
                            {key === "sms"
                              ? "SMS Notifications"
                              : key === "push"
                              ? "Push Notifications"
                              : "Email Notifications"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {key === "sms"
                              ? "Urgent alerts via SMS"
                              : key === "push"
                              ? "Get app alerts"
                              : "Receive updates via email"}
                          </p>
                        </div>

                        <Switch
                          checked={
                            notifications[key as keyof typeof notifications]
                          }
                          disabled={!isEditing}
                          onCheckedChange={(checked) =>
                            handleInputChange("notifications", key, checked)
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* PRIVACY */}
                  <div className="space-y-3">
                    <Label className="font-medium">Privacy</Label>

                    {["shareWithDoctors", "anonymousData"].map((key) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">
                            {key === "shareWithDoctors"
                              ? "Share with Doctors"
                              : "Anonymous Data Sharing"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {key === "shareWithDoctors"
                              ? "Allow doctors to view your records"
                              : "Share anonymized health data"}
                          </p>
                        </div>

                        <Switch
                          checked={privacy[key as keyof typeof privacy]}
                          disabled={!isEditing}
                          onCheckedChange={(checked) =>
                            handleInputChange("privacy", key, checked)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ProfileSettingsPage;

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Heart,
  Activity,
  Shield,
  Edit,
  Save,
  Camera,
  Crown,
  Star,
} from "lucide-react";
import MainLayout from "@/components/layout/main-layout";
import {
  fetchProfile as fetchProfileDataAction,
  submitProfileUpdate,
} from "@/services/ProfileService";
import { toast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Loader from "@/components/ui/loader";
import PinGenerate from "./components/PinGenerate";
import api from "@/utils/api";

interface ProfileData {
  basic_details: {
    avatar: string;
    first_name: string;
    last_name: string;
    email: string;
    patient_id: string;
    phone: string;
    doctor_pin: string | null;
    doctor_url: string | null;
  };
  personal_information: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    address: string;
  };
  medical_information: {
    bloodType: string;
    height: string;
    weight: string;
    allergies: string;
    medications: string;
    emergencyContact: string;
    primaryDoctor: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacy: {
    shareWithDoctors: boolean;
    anonymousData: boolean;
  };
  subscription_status: {
    plan: string;
    status: string;
    nextBilling: string;
    recordsUsed: number;
    recordsLimit: number;
  };
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace("/api", "") || "";
  const handleSave = async () => {
    if (!profileData) return;

    const payload = {
      ...profileData.basic_details,
      ...profileData.personal_information,
      ...profileData.medical_information,
      notifications: profileData.notifications,
      privacy: profileData.privacy,
      avatar: avatarFile ? avatarFile : null,
    };

    setIsSaving(true);

    try {
      const response = await submitProfileUpdate(payload, dispatch);

      toast({
        title: "Profile updated ✅",
        description: "Your profile changes have been saved successfully.",
        variant: "default",
      });

      setIsEditing(false);
    } catch (error: any) {
      console.error("Error saving profile:", error);

      let formattedMessage = "Something went wrong while saving your profile.";

      // Check if API returned validation errors
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        formattedMessage = Object.entries(errors)
          .map(([field, messages]) => {
            // messages can be unknown, assert it's an array of strings
            const msgs = Array.isArray(messages)
              ? messages
              : [String(messages)];
            return `${field}: ${msgs.join(", ")}`;
          })
          .join("\n");
      } else if (error.response?.data?.message) {
        formattedMessage = String(error.response.data.message);
      }

      toast({
        title: "Update failed ❌",
        description: formattedMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setProfileData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        [field]: value,
      },
    }));
  };

  //profile image change

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // check size (50MB = 50 * 1024 * 1024 bytes)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description:
            "File size cannot exceed 2MB. Please choose a smaller image.",
          variant: "destructive",
        });
        return;
      }

      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);

      // toast({
      //   title: "File selected",
      //   description: file.name,
      // });
    }
  };

  // api calling get profileData

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        const response = await api.get("/profile/show");

        if (response.data.success) {
          setProfileData(response.data.data);
        } else {
          console.error("Failed to fetch profile data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  //Distrucure from api response
  const {
    basic_details,
    personal_information,
    medical_information,
    notifications,
    privacy,
    subscription_status,
  } = profileData || {};

  if (loading) {
    return <Loader />;
  }

  if (!profileData || Object.keys(profileData).length === 0) {
    return <div>No profile data found</div>;
  }
  // console.log("avatar", {
  //   basic_details: `${BASE_URL}/${basic_details?.avatar || ""}`,
  // });

  return (
    <MainLayout>
      <div className="relative">
        {isSaving && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
            <Loader size="lg" />
          </div>
        )}
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Profile Settings</h1>
              <p className="text-gray-600">
                Manage your personal information and preferences
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Picture & Basic Info */}

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={
                          avatarUrl
                            ? avatarUrl
                            : user?.avatar
                            ? `${BASE_URL}/${user.avatar}`
                            : "/noProfileImage.png"
                        }
                        alt="User Avatar"
                      />

                      <AvatarFallback className="text-2xl">
                        {user?.first_name?.[0] || ""}
                        {user?.first_name?.[0] || ""}
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
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                      </>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold">
                    {user?.first_name} {user?.first_name}
                  </h2>
                  <p className="text-gray-600">
                    {user?.email || basic_details?.email}
                  </p>
                  <p className="text-gray-600">{basic_details?.phone}</p>

                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Badge variant="outline" className="gap-1">
                      Verified
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      Patient ID: {basic_details?.patient_id || "N/A"}
                    </Badge>
                  </div>

                  {/* pin generate */}
                  <PinGenerate
                    pin={basic_details?.doctor_pin}
                    url={basic_details?.doctor_url}
                  />
                </CardContent>
              </Card>

              {/* Subscription Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-600" />
                    Subscription Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Current Plan</span>
                    <Badge className="bg-gray-100 text-gray-800">
                      {subscription_status?.plan ?? "N/A"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      {subscription_status?.status ?? "N/A"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">Records Used</span>
                    <span className="text-sm">
                      {subscription_status?.recordsUsed ?? 0}/
                      {subscription_status?.recordsLimit ?? 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">Next Billing</span>
                    <span className="text-sm">
                      {subscription_status?.nextBilling ?? "N/A"}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full gap-2 bg-transparent"
                  >
                    <Star className="h-4 w-4" />
                    Upgrade Plan
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Health Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Total Tests</span>
                    <Badge variant="outline">47</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Test</span>
                    <span className="text-sm text-gray-600">3 days ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Health Score</span>
                    <Badge className="bg-green-100 text-green-800">
                      Excellent
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Member Since</span>
                    <span className="text-sm text-gray-600">Jan 2023</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Your basic personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={personal_information?.firstName}
                        onChange={(e) =>
                          handleInputChange(
                            "personal_information",
                            "firstName",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={personal_information?.lastName}
                        onChange={(e) =>
                          handleInputChange(
                            "personal_information",
                            "lastName",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    {/* <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={personal_information?.email}
                      onChange={(e) =>
                        handleInputChange(
                          "personal_information",
                          "email",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                    />
                  </div> */}
                    {/* <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={personal_information?.phone}
                        onChange={(e) =>
                          handleInputChange(
                            "personal_information",
                            "phone",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div> */}
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={personal_information?.dateOfBirth}
                        onChange={(e) =>
                          handleInputChange(
                            "personal_information",
                            "dateOfBirth",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={personal_information?.gender}
                        onValueChange={(value) =>
                          handleInputChange(
                            "personal_information",
                            "gender",
                            value
                          )
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={personal_information?.address}
                      onChange={(e) =>
                        handleInputChange(
                          "personal_information",
                          "address",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Medical Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Medical Information
                  </CardTitle>
                  <CardDescription>
                    Important medical details for healthcare providers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Select
                        value={medical_information?.bloodType || "B+"}
                        onValueChange={(value) =>
                          handleInputChange(
                            "medical_information",
                            "bloodType",
                            value
                          )
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height(cm)</Label>
                      <Input
                        id="height"
                        value={medical_information?.height}
                        onChange={(e) =>
                          handleInputChange(
                            "medical_information",
                            "height",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
                        placeholder="e.g., 150"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight(Kg)</Label>
                      <Input
                        id="weight"
                        value={medical_information?.weight}
                        onChange={(e) =>
                          handleInputChange(
                            "medical_information",
                            "weight",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
                        placeholder="e.g., 60" // Fixed unterminated string literal
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                      id="allergies"
                      value={medical_information?.allergies}
                      onChange={(e) =>
                        handleInputChange(
                          "medical_information",
                          "allergies",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      placeholder="List any known allergies..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea
                      id="medications"
                      value={medical_information?.medications}
                      onChange={(e) =>
                        handleInputChange(
                          "medical_information",
                          "medications",
                          e.target.value
                        )
                      }
                      disabled={!isEditing}
                      placeholder="List current medications and dosages..."
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">
                        Emergency Contact
                      </Label>
                      <Input
                        id="emergencyContact"
                        value={medical_information?.emergencyContact}
                        onChange={(e) =>
                          handleInputChange(
                            "medical_information",
                            "emergencyContact",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
                        placeholder="Name - Phone Number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryDoctor">Primary Doctor</Label>
                      <Input
                        id="primaryDoctor"
                        value={medical_information?.primaryDoctor}
                        onChange={(e) =>
                          handleInputChange(
                            "medical_information",
                            "primaryDoctor",
                            e.target.value
                          )
                        }
                        disabled={!isEditing}
                        placeholder="Dr. Name"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy & Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    Privacy & Notifications
                  </CardTitle>
                  <CardDescription>
                    Control how your data is shared and how you receive
                    notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Preferences</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">
                            Email Notifications
                          </Label>
                          <p className="text-sm text-gray-600">
                            Receive test results and reminders via email
                          </p>
                        </div>
                        <Switch
                          checked={notifications?.email}
                          onCheckedChange={(checked) =>
                            handleInputChange("notifications", "email", checked)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">SMS Notifications</Label>
                          <p className="text-sm text-gray-600">
                            Receive urgent alerts via text message
                          </p>
                        </div>
                        <Switch
                          checked={notifications?.sms}
                          onCheckedChange={(checked) =>
                            handleInputChange("notifications", "sms", checked)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">
                            Push Notifications
                          </Label>
                          <p className="text-sm text-gray-600">
                            Receive notifications on your mobile device
                          </p>
                        </div>
                        <Switch
                          checked={notifications?.push}
                          onCheckedChange={(checked) =>
                            handleInputChange("notifications", "push", checked)
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Privacy Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">
                            Share with Healthcare Providers
                          </Label>
                          <p className="text-sm text-gray-600">
                            Allow doctors to access your test results
                          </p>
                        </div>
                        <Switch
                          checked={privacy?.shareWithDoctors}
                          onCheckedChange={(checked) =>
                            handleInputChange(
                              "privacy",
                              "shareWithDoctors",
                              checked
                            )
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">
                            Anonymous Data Sharing
                          </Label>
                          <p className="text-sm text-gray-600">
                            Help improve healthcare research with anonymized
                            data
                          </p>
                        </div>
                        <Switch
                          checked={privacy?.anonymousData}
                          onCheckedChange={(checked) =>
                            handleInputChange(
                              "privacy",
                              "anonymousData",
                              checked
                            )
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

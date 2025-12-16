"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import api from "@/utils/api";

// Components
import ProfileHeader from "./components/ProfileHeader";
import ProfileLayoutGrid from "./components/ProfileLayoutGrid";
import { validatePersonalInfo } from "./components/Validation";
import {
  DoctorCategories,
  DoctorCouncil,
  DoctorDegree,
} from "@/services/DoctorService";
import { setAuthUpdate } from "@/lib/slices/authSlice";
import { useDispatch } from "react-redux";

// DEFAULT STATES
const defaultPersonalInfo = {
  firstName: "",
  lastName: "",
  email: "",
  gender: "",
  address: "",
  alt_no: "",
  avatar: "",
  phone: "",
  doctorId: "",
  qualification: "",
  hospital_name: "",
  specialization: "",
  availabilityStatus: "",
  experience: "",
  dob: "",
  registration: {
    medicalCouncil: "",
    registrationNumber: "",
    year_of_passing: "",
    month_of_passing: "",
  },
};

const defaultNotifications = { email: false, sms: false, push: false };
const defaultPrivacy = { shareWithDoctors: false, anonymousData: false };

const ProfileSettingsPage = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [personalInfo, setPersonalInfo] = useState(defaultPersonalInfo);
  const [originalInfo, setOriginalInfo] = useState(defaultPersonalInfo);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [privacy, setPrivacy] = useState(defaultPrivacy);
  const [errors, setErrors] = useState<any>({});
  const [categories, setCategories] = useState([]);
  const [council, setCouncil] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qualifications, setQualifications] = useState([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace("/api", "") || "";

  // Fetch profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/doctor/profile/show");
        if (res.data.success) {
          const d = res.data.data;

          const fetchedInfo = {
            ...defaultPersonalInfo,

            firstName: d.basicInfo.firstName || "",
            lastName: d.basicInfo.lastName || "",
            email: d.basicInfo.email || "",
            phone: d.basicInfo.phone || "",
            experience: d.basicInfo.experience || "",
            avatar: d.basicInfo.profileImage || "",
            gender: d.personalInfo.gender || "",
            qualification: d.basicInfo.qualification || "",
            specialization: d.basicInfo.specialization || "",
            availabilityStatus: d.basicInfo.availabilityStatus || "",
            doctorId: d.basicInfo.doctorId || "",
            dob: "",
            alt_no: "",
            address: "",
            hospital_name: "",

            registration: {
              ...defaultPersonalInfo.registration,
              medicalCouncil: d.personalInfo.registration?.medicalCouncil || "",
              registrationNumber:
                d.personalInfo.registration?.registrationNumber || "",
              year_of_passing: d.personalInfo.registration?.year_of_pass || "",
              month_of_passing:
                d.personalInfo.registration?.month_of_pass || "",
            },
          };

          // Now TypeScript is satisfied: object contains ALL keys
          setPersonalInfo(fetchedInfo);
          setOriginalInfo(fetchedInfo);

          setAvatarUrl(
            d.basicInfo.profileImage
              ? `${BASE_URL}/${d.basicInfo.profileImage}`
              : ""
          );
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //doctor Categories
  useEffect(() => {
    const loadCategories = async () => {
      const res = await DoctorCategories(); // API call
      setCategories(res.data); // store data
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadCouncil = async () => {
      const res = await DoctorCouncil(); // API call
      setCouncil(res.data); // store data
    };
    loadCouncil();
  }, []);

  useEffect(() => {
    const loadCouncil = async () => {
      const res = await DoctorDegree(); // API call
      setQualifications(res.data); // store data
    };
    loadCouncil();
  }, []);

  // Handle field changes
  const handleInputChange = (section: string, key: string, value: any) => {
    //  Clear this field's error when user types
    setErrors((prev: any) => ({ ...prev, [key]: "" }));
    if (section === "personalInfo") {
      setPersonalInfo((p) => ({ ...p, [key]: value }));
    }

    if (section === "registration") {
      setPersonalInfo((p) => ({
        ...p,
        registration: {
          ...p.registration,
          [key]: value,
        },
      }));
    }

    if (section === "notifications") {
      setNotifications((p) => ({ ...p, [key]: value }));
    }

    if (section === "privacy") {
      setPrivacy((p) => ({ ...p, [key]: value }));
    }
  };

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file)); // instant preview
    }
  };

  const handleSave = async () => {
    if (!validatePersonalInfo(personalInfo, setErrors)) {
      toast({
        title: "Validation Error",
        description: "Please fill required fields",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();

    // BASIC FIELDS
    formData.append("personalInfo[firstName]", personalInfo.firstName || "");
    formData.append("personalInfo[lastName]", personalInfo.lastName || "");

    // QUALIFICATION ARRAY (convert to numbers)
    if (Array.isArray(personalInfo.qualification)) {
      personalInfo.qualification.forEach((q, index) => {
        formData.append(
          `personalInfo[qualification][${index}]`,
          Number(q).toString()
        );
      });
    }

    formData.append("personalInfo[experience]", personalInfo.experience || "");
    formData.append(
      "personalInfo[availabilityStatus]",
      personalInfo.availabilityStatus || ""
    );
    formData.append("personalInfo[gender]", personalInfo.gender || "");
    formData.append("personalInfo[dob]", personalInfo.dob || "");
    formData.append("personalInfo[alt_no]", personalInfo.alt_no || "");

    // SPECIALITY (convert to number)
    formData.append(
      "personalInfo[speciality]",
      Number(personalInfo.specialization || 0).toString()
    );

    formData.append(
      "personalInfo[hospital_name]",
      personalInfo.hospital_name || ""
    );
    formData.append("personalInfo[address]", personalInfo.address || "");

    // REGISTRATION (nested)
    formData.append(
      "personalInfo[registration][medicalCouncil]",
      Number(personalInfo.registration?.medicalCouncil || 0).toString()
    );

    formData.append(
      "personalInfo[registration][registrationNumber]",
      personalInfo.registration?.registrationNumber || ""
    );

    formData.append(
      "personalInfo[registration][year_of_passing]",
      Number(personalInfo.registration?.year_of_passing || 0).toString()
    );

    formData.append(
      "personalInfo[registration][month_of_passing]",
      Number(personalInfo.registration?.month_of_passing || 0).toString()
    );

    // PROFILE IMAGE
    if (avatarFile) {
      formData.append("personalInfo[profileImage]", avatarFile);
    } else if (personalInfo.avatar) {
      formData.append("personalInfo[profileImage]", personalInfo.avatar);
    }

    try {
      const response = await api.post("/doctor/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedUser = response.data.data.user;
      const token = response.data.data.user;
      // const token = store.getState().auth.token;

      dispatch(setAuthUpdate({ user: updatedUser, token }));

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Save failed", error);
      toast({
        title: "Save Failed",
        description: "Could not update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setPersonalInfo(originalInfo);
    setAvatarUrl(
      originalInfo.avatar ? `${BASE_URL}/${originalInfo.avatar}` : ""
    );
    setIsEditing(false);
    setErrors({});
  };

  return (
    <>
      <ProfileHeader
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onCancel={handleCancel}
        onSave={handleSave}
      />

      <ProfileLayoutGrid
        isEditing={isEditing}
        personalInfo={personalInfo}
        loading={loading}
        categories={categories}
        qualifications={qualifications}
        council={council}
        notifications={notifications}
        privacy={privacy}
        errors={errors}
        avatarUrl={avatarUrl}
        fileInputRef={fileInputRef}
        setAvatarFile={setAvatarFile}
        setAvatarUrl={setAvatarUrl}
        handleInputChange={handleInputChange}
        onFileChange={handleAvatarChange}
      />
    </>
  );
};

export default ProfileSettingsPage;

"use client";

import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LocationPickerMap from "@/components/LocationPickerMap";
import { X, Upload } from "lucide-react";
import {
  AmbulanceCreate,
  fetchAmbulanceType,
} from "@/services/EmergencyService";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  validateAmbulanceForm,
  ValidationErrors,
} from "@/validation/ambulanceValidation";

/* ---------------- EQUIPMENT OPTIONS ---------------- */
const equipmentOptions = [
  { id: "available", label: "Currently Available" },
  { id: "ac", label: "AC" },
  { id: "oxygen_cylinder", label: "Oxygen Cylinder" },
  { id: "first_aid_kit", label: "First Aid Kit" },
  { id: "suction_apparatus", label: "Suction Apparatus" },
  { id: "portable_stretcher", label: "Portable Stretcher" },
  { id: "cardiac_monitor", label: "Cardiac Monitor" },
  { id: "ventilator", label: "Ventilator" },
  { id: "infusion_pumps", label: "Infusion Pumps" },
  { id: "nebulizer", label: "Nebulizer" },
  { id: "multi_parameter_monitor", label: "Multi-parameter Monitor" },
  { id: "transport_ventilator", label: "Transport Ventilator" },
  { id: "emergency_drugs_cabinet", label: "Emergency Drugs Cabinet" },
] as const;

type EquipmentId = (typeof equipmentOptions)[number]["id"];

/* -----------------------------------------------
     INTERFACES
--------------------------------------------------*/
interface AmbulanceType {
  id: number;
  name: string;
}

interface FormState {
  car_model: string;
  reg_name: string;
  reg_ambulance_no: string;
  reg_phone: string;
  alternative_phone: string;
  address_line1: string;
  pincode: string;
  latitude: string | number;
  longitude: string | number;
  is_available: number;
  ambulance_typeId: string;
  // Equipment (default 0)
  available: number;
  ac: number;
  oxygen_cylinder: number;
  first_aid_kit: number;
  suction_apparatus: number;
  portable_stretcher: number;
  cardiac_monitor: number;
  ventilator: number;
  infusion_pumps: number;
  nebulizer: number;
  multi_parameter_monitor: number;
  transport_ventilator: number;
  emergency_drugs_cabinet: number;
}

const Page = () => {
  const router = useRouter();

  /* -----------------------------------------------
     FIXED LOCATION (Kolkata Default)
  --------------------------------------------------*/
  const kolkataLocation = {
    lat: 22.5726,
    lng: 88.3639,
  };

  /* -----------------------------------------------
     FORM STATE & ERRORS
  --------------------------------------------------*/
  const [form, setForm] = useState<FormState>({
    car_model: "",
    reg_name: "",
    reg_ambulance_no: "",
    reg_phone: "",
    alternative_phone: "",
    address_line1: "",
    pincode: "",
    latitude: kolkataLocation.lat,
    longitude: kolkataLocation.lng,
    is_available: 1,
    ambulance_typeId: "",
    // Equipment (default 0)
    available: 0,
    ac: 0,
    oxygen_cylinder: 0,
    first_aid_kit: 0,
    suction_apparatus: 0,
    portable_stretcher: 0,
    cardiac_monitor: 0,
    ventilator: 0,
    infusion_pumps: 0,
    nebulizer: 0,
    multi_parameter_monitor: 0,
    transport_ventilator: 0,
    emergency_drugs_cabinet: 0,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /* -----------------------------------------------
     FORM HANDLERS
  --------------------------------------------------*/
  const handleInputChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    // Mark field as touched when user changes it
    setTouched((prev) => ({ ...prev, [key]: true }));

    // Clear error when user starts typing
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [key]: true }));

    // Clear error
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleCheckbox = (key: EquipmentId) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key] === 1 ? 0 : 1,
    }));
  };

  /* -----------------------------------------------
     VALIDATION FUNCTION
  --------------------------------------------------*/
  const validateForm = (): boolean => {
    const validationErrors = validateAmbulanceForm(form);
    setErrors(validationErrors);

    // Mark all validated fields as touched to show errors
    const touchedFields = { ...touched };
    Object.keys(validationErrors).forEach((key) => {
      touchedFields[key] = true;
    });
    setTouched(touchedFields);

    return Object.keys(validationErrors).length === 0;
  };

  /* -----------------------------------------------
     IMAGE UPLOAD
  --------------------------------------------------*/
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload only images");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert("Image must be below 15MB");
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setUploadedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setUploadedImage(null);
    setImagePreview(null);
  };

  /* -----------------------------------------------
     FETCH AMBULANCE TYPES
  --------------------------------------------------*/
  const [ambulanceTypes, setAmbulanceTypes] = useState<AmbulanceType[]>([]);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const res = await fetchAmbulanceType();
        setAmbulanceTypes(res.data);
      } catch (err) {
        console.error("Error loading ambulance types:", err);
      }
    };
    loadTypes();
  }, []);

  const handleLocationSelect = (
    lat: number,
    lng: number,
    pincode: string,
    address_line1: string
  ) => {
    setForm((prev) => ({
      ...prev,
      address_line1,
      pincode,
      latitude: lat,
      longitude: lng,
    }));

    // Clear address errors when location is selected
    if (errors.address_line1 || errors.pincode) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.address_line1;
        delete newErrors.pincode;
        return newErrors;
      });
    }
  };

  /* -----------------------------------------------
     SAVE FORM
  --------------------------------------------------*/
  const handleSave = async () => {
    // Validate form before submission
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create FormData
      const formData = new FormData();

      // Append all form fields
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      // Append image if exists
      if (uploadedImage) {
        formData.append("image", uploadedImage);
      }

      // API call
      const res = await AmbulanceCreate(formData);

      if (res?.success) {
        toast({
          title: "Created Successfully 🎉",
          description: "Ambulance has been added successfully.",
        });
        router.push("/ambulance/list");
        return;
      }

      // Handle API error response
      handleApiError(res);
    } catch (err: any) {
      // Handle network or unexpected errors
      handleApiError(err?.response?.data || err);
    }
  };

  /* -----------------------------------------------
     ERROR HANDLER
  --------------------------------------------------*/
  const handleApiError = (error: any) => {
    if (!error) {
      toast({
        title: "Unknown Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return;
    }

    // Handle validation errors (array format)
    if (error?.errors) {
      Object.values(error.errors).forEach((msgArr: any) => {
        if (Array.isArray(msgArr) && msgArr[0]) {
          toast({
            title: "Validation Error",
            description: msgArr[0],
            variant: "destructive",
          });
        }
      });
      return;
    }

    // Handle single error message
    if (error?.message) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Fallback error
    toast({
      title: "Something went wrong",
      description: "Please try again later",
      variant: "destructive",
    });
  };

  /* -----------------------------------------------
     HELPER FUNCTION FOR INPUT STYLING
  --------------------------------------------------*/
  const getInputClass = (fieldName: keyof FormState) => {
    const hasError = errors[fieldName] && touched[fieldName];
    return hasError
      ? "w-full border-red-500 focus:border-red-500 focus:ring-red-500"
      : "w-full";
  };

  /* -----------------------------------------------
     HELPER FUNCTION FOR SELECT STYLING
  --------------------------------------------------*/
  const getSelectClass = (fieldName: keyof FormState) => {
    const hasError = errors[fieldName] && touched[fieldName];
    return hasError ? "border-red-500" : "";
  };

  /* -----------------------------------------------
     UI COMPONENT
  --------------------------------------------------*/
  return (
    <MainLayout>
      <div className="w-[74%] mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Add Ambulance
            </CardTitle>
          </CardHeader>

          <CardContent className="mx-4">
            <div className="flex w-full">
              {/* LEFT SECTION */}
              <div className="basis-[62%] pr-4 flex flex-col gap-6">
                {/* Ambulance Type */}
                <div className="flex items-start gap-4">
                  <Label className="min-w-[140px] whitespace-nowrap mt-2">
                    Ambulance Type <span className="text-red-500">*</span>
                  </Label>

                  <div className="flex-1">
                    <Select
                      value={form.ambulance_typeId}
                      onValueChange={(value) =>
                        handleSelectChange("ambulance_typeId", value)
                      }
                    >
                      <SelectTrigger
                        className={`w-full ${getSelectClass(
                          "ambulance_typeId"
                        )}`}
                      >
                        <SelectValue placeholder="Select ambulance type" />
                      </SelectTrigger>

                      <SelectContent>
                        {ambulanceTypes.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.ambulance_typeId && touched.ambulance_typeId && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.ambulance_typeId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Ambulance Name */}
                <div className="flex items-center gap-4">
                  <Label className="min-w-[140px]">Ambulance Name</Label>
                  <div className="flex-1">
                    <Input
                      value={form.reg_name}
                      onChange={(e) =>
                        handleInputChange("reg_name", e.target.value)
                      }
                      placeholder="Enter Ambulance Name"
                      className={getInputClass("reg_name")}
                    />
                  </div>
                </div>

                {/* Ambulance Number */}
                <div className="flex items-center gap-4">
                  <Label className="min-w-[140px]">Ambulance Number</Label>
                  <div className="flex-1">
                    <Input
                      value={form.reg_ambulance_no}
                      onChange={(e) =>
                        handleInputChange("reg_ambulance_no", e.target.value)
                      }
                      placeholder="Enter Ambulance Number"
                      className={getInputClass("reg_ambulance_no")}
                    />
                  </div>
                </div>

                {/* Car Model */}
                <div className="flex items-center gap-4">
                  <Label className="min-w-[140px]">Car Model</Label>
                  <div className="flex-1">
                    <Input
                      value={form.car_model}
                      onChange={(e) =>
                        handleInputChange("car_model", e.target.value)
                      }
                      placeholder="Enter Car Model"
                      className={getInputClass("car_model")}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <Label className="min-w-[140px] mt-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex-1">
                    <Input
                      value={form.reg_phone}
                      onChange={(e) =>
                        handleInputChange("reg_phone", e.target.value)
                      }
                      placeholder="Enter Mobile Number"
                      className={getInputClass("reg_phone")}
                    />
                    {errors.reg_phone && touched.reg_phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.reg_phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Alt Phone */}
                <div className="flex items-start gap-4">
                  <Label className="min-w-[140px] mt-2">Alt Mobile No.</Label>
                  <div className="flex-1">
                    <Input
                      value={form.alternative_phone}
                      onChange={(e) =>
                        handleInputChange("alternative_phone", e.target.value)
                      }
                      placeholder="Enter Alternative Number"
                      className={getInputClass("alternative_phone")}
                    />
                    {errors.alternative_phone && touched.alternative_phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.alternative_phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Pincode */}
                <div className="flex items-start gap-4">
                  <Label className="min-w-[140px] mt-2">
                    Pincode <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex-1">
                    <Input
                      value={form.pincode}
                      onChange={(e) =>
                        handleInputChange("pincode", e.target.value)
                      }
                      placeholder="6 digit PinCode"
                      className={getInputClass("pincode")}
                    />
                    {errors.pincode && touched.pincode && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <Label className="min-w-[140px] mt-2">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex-1">
                    <Input
                      value={form.address_line1}
                      onChange={(e) =>
                        handleInputChange("address_line1", e.target.value)
                      }
                      placeholder="House/Street/Locality"
                      className={getInputClass("address_line1")}
                    />
                    {errors.address_line1 && touched.address_line1 && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.address_line1}
                      </p>
                    )}
                  </div>
                </div>

                {/* Map */}
                <LocationPickerMap
                  lat={22.5726}
                  lng={88.3639}
                  onLocationSelect={handleLocationSelect}
                />
              </div>

              {/* DIVIDER */}
              <div className="w-px bg-gray-300" />

              {/* RIGHT SECTION */}
              <div className="basis-[42%] pl-6">
                <div>
                  <div className="text-sm font-semibold text-gray-400 mb-4 underline">
                    Equipment & Facilities
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    {equipmentOptions.map((opt) => {
                      const isLong = opt.label.length > 15;
                      return (
                        <div
                          key={opt.id}
                          className={`flex items-start gap-2 ${
                            isLong ? "col-span-2" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={form[opt.id] === 1}
                            onChange={() => handleCheckbox(opt.id)}
                            className="h-4 w-4 mt-1"
                          />

                          <Label className="text-sm text-gray-700 leading-tight">
                            {opt.label}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="mt-6">
                  <Label className="text-sm font-semibold block mb-2">
                    Upload Image
                  </Label>

                  {!imagePreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer">
                      <Upload className="w-8 h-8 mb-2 text-gray-600" />
                      <p className="mb-1 text-sm text-gray-600">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag & drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF (max 15MB)
                      </p>

                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  ) : (
                    <div className="relative w-full h-36 border rounded-lg overflow-hidden flex justify-center">
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="w-40 h-32"
                      />

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* BUTTONS */}
                <div className="flex justify-between items-center mt-8">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Page;

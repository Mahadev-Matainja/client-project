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
  fetchAmbulanceType,
  AmbulanceEdit,
  AmbulanceUpdate, // Assuming you have this function
} from "@/services/EmergencyService";
import { toast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import {
  validateAmbulanceForm,
  ValidationErrors,
} from "@/validation/ambulanceValidation";
import EditAmbulanceShimmer from "./components/EditAmbulanceSkeleton";

/* ---------------- EQUIPMENT OPTIONS ---------------- */
const equipmentOptions = [
  { id: "is_available", label: "Currently Available" },
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

interface AmbulanceData {
  id: number;
  user_id: number;
  reg_name: string;
  reg_ambulance_no: string;
  reg_phone: string;
  alternative_phone: string | null;
  address_line1: string;
  address_line2: string | null;
  landmark: string | null;
  state_id: number;
  district_id: number;
  city_id: number;
  pincode: string;
  longitude: string;
  latitude: string;
  additional_text: string | null;
  is_verified: number;
  status: number;
  is_available: number;
  ambulance_typeId: number;
  image: string | null;
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
  car_model: string | null;
  created_at: string;
  updated_at: string;
  type: {
    id: number;
    name: string;
  };
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
  // Equipment
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
  const params = useParams();
  const id = params.id;

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
    latitude: 22.5726,
    longitude: 88.3639,
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
  const [isLoading, setIsLoading] = useState(false);
  const [ambulanceTypes, setAmbulanceTypes] = useState<AmbulanceType[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  /* -----------------------------------------------
     FETCH AMBULANCE DATA
  --------------------------------------------------*/
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await AmbulanceEdit(Number(id));
        const data: AmbulanceData = res.ambulance;

        // Set form state from API response
        setForm({
          car_model: data.car_model || "",
          reg_name: data.reg_name || "",
          reg_ambulance_no: data.reg_ambulance_no || "",
          reg_phone: data.reg_phone || "",
          alternative_phone: data.alternative_phone || "",
          address_line1: data.address_line1 || "",
          pincode: data.pincode || "",
          latitude: data.latitude || 22.5726,
          longitude: data.longitude || 88.3639,
          is_available: data.is_available,
          ambulance_typeId: String(data.ambulance_typeId),
          // Equipment values
          available: data.is_available,
          ac: data.ac,
          oxygen_cylinder: data.oxygen_cylinder,
          first_aid_kit: data.first_aid_kit,
          suction_apparatus: data.suction_apparatus,
          portable_stretcher: data.portable_stretcher,
          cardiac_monitor: data.cardiac_monitor,
          ventilator: data.ventilator,
          infusion_pumps: data.infusion_pumps,
          nebulizer: data.nebulizer,
          multi_parameter_monitor: data.multi_parameter_monitor,
          transport_ventilator: data.transport_ventilator,
          emergency_drugs_cabinet: data.emergency_drugs_cabinet,
        });

        // Set image preview if exists
        if (data.image) {
          setImagePreview(data.image);
        }
      } catch (err) {
        console.error("Error loading ambulance data", err);
        toast({
          title: "Error",
          description: "Failed to load ambulance data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  /* -----------------------------------------------
     FETCH AMBULANCE TYPES
  --------------------------------------------------*/
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

  /* -----------------------------------------------
     FORM HANDLERS
  --------------------------------------------------*/
  const handleInputChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
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
    setTouched((prev) => ({ ...prev, [key]: true }));
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
     IMAGE UPLOAD HANDLERS
  --------------------------------------------------*/
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
     LOCATION HANDLER
  --------------------------------------------------*/
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
     VALIDATION FUNCTION
  --------------------------------------------------*/
  const validateForm = (): boolean => {
    const validationErrors = validateAmbulanceForm(form);
    setErrors(validationErrors);

    const touchedFields = { ...touched };
    Object.keys(validationErrors).forEach((key) => {
      touchedFields[key] = true;
    });
    setTouched(touchedFields);

    return Object.keys(validationErrors).length === 0;
  };

  /* -----------------------------------------------
     UPDATE FORM
  --------------------------------------------------*/
  const handleUpdate = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();

      // Append all form fields
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      // Append image if exists
      if (uploadedImage) {
        formData.append("image", uploadedImage);
      }

      // API call to update
      const res = await AmbulanceUpdate(Number(id), formData);

      if (res?.success) {
        toast({
          title: "Updated Successfully 🎉",
          description: "Ambulance has been updated successfully.",
        });
        router.push("/ambulance/list");
        return;
      }

      handleApiError(res);
    } catch (err: any) {
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

    if (error?.message) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Something went wrong",
      description: "Please try again later",
      variant: "destructive",
    });
  };

  /* -----------------------------------------------
     HELPER FUNCTIONS FOR STYLING
  --------------------------------------------------*/
  const getInputClass = (fieldName: keyof FormState) => {
    const hasError = errors[fieldName] && touched[fieldName];
    return hasError
      ? "w-full border-red-500 focus:border-red-500 focus:ring-red-500"
      : "w-full";
  };

  const getSelectClass = (fieldName: keyof FormState) => {
    const hasError = errors[fieldName] && touched[fieldName];
    return hasError ? "border-red-500" : "";
  };

  /* -----------------------------------------------
     LOADING STATE
  --------------------------------------------------*/
  if (isLoading) {
    return (
      <MainLayout>
        <EditAmbulanceShimmer />
      </MainLayout>
    );
  }

  /* -----------------------------------------------
     UI COMPONENT
  --------------------------------------------------*/
  return (
    <MainLayout>
      <div className="w-[74%] mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Edit Ambulance
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

                {/* Map - Using current location from form */}
                <LocationPickerMap
                  lat={Number(form.latitude)}
                  lng={Number(form.longitude)}
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
                        className="w-40 h-32 object-contain"
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
                    onClick={handleUpdate}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 cursor-pointer"
                  >
                    Update
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

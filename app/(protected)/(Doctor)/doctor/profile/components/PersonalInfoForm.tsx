import React, { useEffect, useMemo, useState } from "react";
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronRight, User } from "lucide-react";

interface Props {
  personalInfo: any;
  categories: any[];
  qualifications: any[];
  errors: Record<string, string>;
  isEditing: boolean;
  handleInputChange: (section: string, field: string, value: any) => void;
}

const PersonalInfoForm: React.FC<Props> = ({
  personalInfo,
  errors,
  categories,
  qualifications,
  isEditing,
  handleInputChange,
}) => {
  // Debounce Hook
  const useDebounce = (value: any, delay = 300) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
  };

  const [searchQualification, setSearchQualification] = useState("");
  const [searchSpeciality, setSearchSpeciality] = useState("");

  const debouncedSearchQualification = useDebounce(searchQualification);
  const debouncedSearchSpeciality = useDebounce(searchSpeciality);

  // Filtered lists
  const filteredQualifications = useMemo(
    () =>
      qualifications.filter((item) =>
        item.name
          .toLowerCase()
          .includes(debouncedSearchQualification.toLowerCase())
      ),
    [debouncedSearchQualification, qualifications]
  );

  const filteredCategories = useMemo(
    () =>
      categories.filter((item) =>
        item.name
          .toLowerCase()
          .includes(debouncedSearchSpeciality.toLowerCase())
      ),
    [debouncedSearchSpeciality, categories]
  );

  // Handle Speciality
  const selectedSpecialityId = personalInfo.specialization || null;
  const selectedSpecialityName = useMemo(() => {
    const selectedItem = categories.find(
      (cat) => cat.id === selectedSpecialityId
    );
    return selectedItem ? selectedItem.name : "";
  }, [selectedSpecialityId, categories]);

  const handleSelectSpeciality = (id: number) => {
    handleInputChange("personalInfo", "specialization", id);
  };

  // Handle Qualification
  const selectedQualificationIds: number[] = personalInfo.qualification || [];
  const handleToggleQualification = (id: number) => {
    let newSelection;
    if (selectedQualificationIds.includes(id)) {
      newSelection = selectedQualificationIds.filter((qid) => qid !== id);
    } else {
      newSelection = [...selectedQualificationIds, id];
    }
    handleInputChange("personalInfo", "qualification", newSelection);
  };

  const selectedQualificationNames = useMemo(
    () =>
      qualifications
        .filter((q) => selectedQualificationIds.includes(q.id))
        .map((q) => q.name)
        .join(", "),
    [selectedQualificationIds, qualifications]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" /> Personal Information
        </CardTitle>
        <CardDescription>Update your basic details</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label>
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={personalInfo.firstName || ""}
              disabled={!isEditing}
              onChange={(e) =>
                handleInputChange("personalInfo", "firstName", e.target.value)
              }
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input
              value={personalInfo.lastName || ""}
              disabled={!isEditing}
              onChange={(e) =>
                handleInputChange("personalInfo", "lastName", e.target.value)
              }
            />
          </div>

          {/* Alternative Contact */}
          <div className="space-y-2">
            <Label>Alternative Contact No.</Label>
            <div className="flex">
              <span className="flex items-center justify-center bg-gray-200 text-gray-700 px-3 rounded-l-md border">
                +91
              </span>
              <Input
                value={personalInfo.alt_no || ""}
                disabled={!isEditing}
                onChange={(e) => {
                  // Get the input value
                  const value = e.target.value;

                  // Allow only numbers
                  const numericValue = value.replace(/\D/g, "");

                  // Limit to 10 digits
                  const finalValue = numericValue.slice(0, 10);

                  // Update the value
                  handleInputChange("personalInfo", "alt_no", finalValue);
                }}
                placeholder="Enter 10-digit number"
                inputMode="numeric" // Shows numeric keyboard on mobile
                maxLength={10} // HTML maxlength attribute
                className="rounded-l-none"
              />
            </div>

            {personalInfo.alt_no && personalInfo.alt_no.length !== 10 && (
              <p className="text-sm text-red-500">
                Please enter exactly 10 digits
              </p>
            )}
          </div>

          {/* Hospital Name */}
          <div className="space-y-2">
            <Label>Hospital Name</Label>
            <Input
              value={personalInfo.hospital_name || ""}
              disabled={!isEditing}
              onChange={(e) =>
                handleInputChange(
                  "personalInfo",
                  "hospital_name",
                  e.target.value
                )
              }
            />
          </div>

          {/* Availability Status */}
          <div className="space-y-2">
            <Label>Availability Status</Label>
            <Select
              value={personalInfo.availabilityStatus || undefined}
              disabled={!isEditing}
              onValueChange={(val) =>
                handleInputChange("personalInfo", "availabilityStatus", val)
              }
            >
              <SelectTrigger
                className={`w-full ${
                  errors.availabilityStatus ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enable">Enable</SelectItem>
                <SelectItem value="disable">Disable</SelectItem>
              </SelectContent>
            </Select>
            {errors.availabilityStatus && (
              <p className="text-red-500 text-sm">
                {errors.availabilityStatus}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input
              type="date"
              value={personalInfo.dob || ""}
              disabled={!isEditing}
              onChange={(e) =>
                handleInputChange("personalInfo", "dob", e.target.value)
              }
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label>Experience</Label>
            <Input
              value={personalInfo.experience || ""}
              disabled={!isEditing}
              onChange={(e) =>
                handleInputChange("personalInfo", "experience", e.target.value)
              }
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>
              Gender <span className="text-red-500">*</span>
            </Label>
            <Select
              value={personalInfo.gender}
              disabled={!isEditing}
              onValueChange={(val) =>
                handleInputChange("personalInfo", "gender", val)
              }
            >
              <SelectTrigger
                className={`w-full ${errors.gender ? "border-red-500" : ""}`}
              >
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

          {/* Qualification Multi Select */}
          <div className="space-y-2">
            <Label>Qualification</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={`w-full flex items-center justify-between border rounded-md px-3 py-2 bg-white ${
                    isEditing
                      ? "cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  } ${
                    errors.qualification ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <span>
                    {selectedQualificationNames || "Select Qualifications"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </DropdownMenuTrigger>

              {isEditing && (
                <DropdownMenuContent
                  className="w-[var(--radix-dropdown-menu-trigger-width)] p-2"
                  align="start"
                >
                  <Input
                    autoFocus
                    placeholder="Search qualifications..."
                    value={searchQualification}
                    onChange={(e) => setSearchQualification(e.target.value)}
                    className="mb-2"
                  />

                  <ScrollArea className="max-h-60">
                    {filteredQualifications.length === 0 ? (
                      <div className="px-2 py-1 text-sm text-gray-500">
                        No results found
                      </div>
                    ) : (
                      filteredQualifications.map((item) => (
                        <DropdownMenuItem
                          key={item.id}
                          onSelect={() => handleToggleQualification(item.id)}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedQualificationIds.includes(
                                item.id
                              )}
                              readOnly
                              className="accent-blue-500"
                            />
                            {item.name}
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </DropdownMenuItem>
                      ))
                    )}
                  </ScrollArea>
                </DropdownMenuContent>
              )}
            </DropdownMenu>

            {errors.qualification && (
              <p className="text-red-500 text-sm">{errors.qualification}</p>
            )}
          </div>

          {/* Speciality */}
          <div className="space-y-2">
            <Label>Speciality</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={`w-full flex items-center justify-between border rounded-md px-3 py-2 bg-white ${
                    isEditing
                      ? "cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  } ${
                    errors.specialization ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <span>{selectedSpecialityName || "Select Speciality"}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </DropdownMenuTrigger>

              {isEditing && (
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) p-2"
                  align="start"
                >
                  <Input
                    autoFocus
                    placeholder="Search..."
                    value={searchSpeciality}
                    onChange={(e) => setSearchSpeciality(e.target.value)}
                    className="mb-2"
                  />

                  <ScrollArea className="max-h-60">
                    {filteredCategories.length === 0 ? (
                      <div className="px-2 py-1 text-sm text-gray-500">
                        No results found
                      </div>
                    ) : (
                      filteredCategories.map((item) => (
                        <DropdownMenuItem
                          key={item.id}
                          onSelect={() => handleSelectSpeciality(item.id)}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {item.name}
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </DropdownMenuItem>
                      ))
                    )}
                  </ScrollArea>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
            {errors.specialization && (
              <p className="text-red-500 text-sm">{errors.specialization}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label>Address</Label>
          <Textarea
            rows={2}
            value={personalInfo.address || ""}
            disabled={!isEditing}
            onChange={(e) =>
              handleInputChange("personalInfo", "address", e.target.value)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;

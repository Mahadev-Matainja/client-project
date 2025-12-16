import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import MonthDropdown from "@/components/MonthDropdown";

interface Props {
  personalInfo: any;
  isEditing: boolean;
  council: any[];
  errors: Record<string, string>;
  handleInputChange: (section: string, field: string, value: any) => void;
}

const RegistrationForm: React.FC<Props> = ({
  personalInfo,
  isEditing,
  council,
  handleInputChange,
  errors,
}) => {
  const registration = personalInfo.registration;

  // Debounce Hook
  const useDebounce = (value: any, delay = 300) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
  };

  const [search, setSearch] = useState("");

  // Selected council ID
  const selectedId = registration.medicalCouncil || "";

  // Debounced search
  const debouncedSearch = useDebounce(search);

  // Get selected council name
  const selectedName = useMemo(() => {
    const item = council.find((c) => c.id === selectedId);
    return item ? item.name : "";
  }, [selectedId, council]);

  // Filter council list by search
  const filteredCouncil = useMemo(() => {
    return council.filter((item) =>
      item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch, council]);

  // Handle council selection
  const handleSelectCouncil = (item: any) => {
    handleInputChange("registration", "medicalCouncil", item.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Registration Information
        </CardTitle>
        <CardDescription>Update your registration details</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Medical Council */}
          <div className="space-y-2">
            <Label>Medical Council</Label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={`w-full flex items-center justify-between border rounded-md px-3 py-2 bg-white ${
                    isEditing
                      ? "cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  } ${
                    errors.medicalCouncil ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <span>{selectedName || "Select Medical Council"}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </DropdownMenuTrigger>

              {isEditing && (
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) p-2"
                  align="start"
                >
                  {/* Search */}
                  <Input
                    autoFocus
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-2"
                  />

                  <ScrollArea className="max-h-60">
                    {filteredCouncil.length === 0 ? (
                      <div className="px-2 py-1 text-sm text-gray-500">
                        No results found
                      </div>
                    ) : (
                      filteredCouncil.map((item) => (
                        <DropdownMenuItem
                          key={item.id}
                          onSelect={() => handleSelectCouncil(item)}
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
            {errors.medicalCouncil && (
              <p className="text-red-500 text-sm">{errors.medicalCouncil}</p>
            )}
          </div>

          {/* Registration Number */}
          <div className="space-y-2">
            <Label>
              Registration Number <span className="text-red-500">*</span>
            </Label>
            <Input
              value={registration.registrationNumber || ""}
              disabled={!isEditing}
              onChange={(e) =>
                handleInputChange(
                  "registration",
                  "registrationNumber",
                  e.target.value
                )
              }
              className={`${
                errors.registrationNumber
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            />
            {errors.registrationNumber && (
              <p className="text-red-500 text-sm">
                {errors.registrationNumber}
              </p>
            )}
          </div>

          {/* Year of Passing */}
          <div className="space-y-2">
            <Label>
              Year Of Passing <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              value={registration.year_of_passing || ""}
              disabled={!isEditing}
              onChange={(e) =>
                handleInputChange(
                  "registration",
                  "year_of_passing",
                  e.target.value
                )
              }
              className={`${
                errors.year_of_passing
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            />
            {errors.year_of_passing && (
              <p className="text-red-500 text-sm">{errors.year_of_passing}</p>
            )}
          </div>

          {/* Month of Passing */}
          <div className="space-y-2">
            <Label>
              Month Of Passing <span className="text-red-500">*</span>
            </Label>

            <MonthDropdown
              value={
                registration.month_of_passing
                  ? registration.month_of_passing.toString().padStart(2, "0")
                  : ""
              }
              disabled={!isEditing}
              onChange={(val: any) =>
                handleInputChange("registration", "month_of_passing", val)
              }
              error={!!errors.month_of_passing}
            />

            {errors.month_of_passing && (
              <p className="text-red-500 text-sm">{errors.month_of_passing}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;

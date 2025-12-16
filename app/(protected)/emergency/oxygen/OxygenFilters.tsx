"use client";

import SearchableDropdown from "@/components/SearchableDropdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  states: any[];
  districts: any[];
  cities: any[];
  pinCode: string | null;
  state: string;
  district: string;
  city: string;
  onStateChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onPinCodeChange: (value: string | null) => void;
  onSearch: () => void;
}

export default function OxygenFilters({
  states,
  districts,
  cities,
  pinCode,
  state,
  district,
  city,
  onStateChange,
  onDistrictChange,
  onCityChange,
  onPinCodeChange,
  onSearch,
}: Props) {
  const [pinError, setPinError] = useState("");

  const validatePin = (value: string) => {
    const num = value.replace(/[^0-9]/g, ""); //  allow only digits

    // keep updating input as user types
    onPinCodeChange(num);

    // validation
    if (num.length === 0) {
      setPinError("");
    } else if (num.length !== 6) {
      setPinError("Pin code must be exactly 6 digits");
    } else {
      setPinError("");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-5">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <SearchableDropdown
          label="State"
          defaultOption="Select State"
          items={states}
          value={state}
          placeholder="Select State"
          onChange={onStateChange}
        />

        <SearchableDropdown
          label="District"
          defaultOption="Select District"
          items={districts}
          value={district}
          placeholder="Select District"
          onChange={onDistrictChange}
          disabled={!state}
        />

        <SearchableDropdown
          label="City"
          defaultOption="Select City"
          items={cities}
          value={city}
          placeholder="Select City"
          onChange={onCityChange}
          disabled={!district}
        />

        <div className="flex flex-col">
          <label className="font-medium text-sm mb-2">
            Pin Code (optional)
          </label>

          <Input
            placeholder="Enter pin code"
            maxLength={6}
            value={pinCode ?? ""}
            onChange={(e) => validatePin(e.target.value)}
            className={pinError ? "border-red-500" : ""}
          />

          {pinError && (
            <span className="text-red-600 text-xs mt-1">{pinError}</span>
          )}
        </div>

        <div className="flex items-end">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            onClick={onSearch}
            disabled={!state}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}

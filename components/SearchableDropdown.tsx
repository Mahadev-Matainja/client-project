"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DropdownProps {
  label: string;
  items: any[];
  placeholder: string;
  value: string;
  defaultOption?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  loading?: boolean; // New loading prop
}

export default function SearchableDropdown({
  label,
  items,
  placeholder,
  value,
  defaultOption = "Select",
  onChange,
  disabled = false,
  loading = false, // Default to false
}: DropdownProps) {
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Custom placeholder when loading
  const selectPlaceholder = loading ? "Loading..." : placeholder;

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="font-medium text-sm mb-2">{label}</label>

      <div className="relative">
        <Select
          value={value || undefined}
          onValueChange={(val) => {
            if (val === "__default__") {
              onChange(undefined as unknown as string);
              setSearch(""); // Clear search when resetting
            } else {
              onChange(val);
              setSearch(""); // Clear search when selecting
            }
          }}
          disabled={disabled || loading} // Disable when loading
        >
          <SelectTrigger
            className="w-full h-11 text-left pr-10" // Add padding for spinner
            disabled={disabled || loading}
          >
            <SelectValue placeholder={selectPlaceholder} />
          </SelectTrigger>

          {!disabled &&
            !loading && ( // Don't show dropdown when loading
              <SelectContent className="max-h-[260px] overflow-y-auto p-2">
                {/* Default option - clickable for reset */}
                <SelectItem value="__default__" className="text-black-500 my-2">
                  {defaultOption}
                </SelectItem>

                {/* Search input */}
                <Input
                  placeholder="Search..."
                  value={search}
                  className="mb-2"
                  onChange={(e) => setSearch(e.target.value)}
                />

                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <SelectItem
                      key={item.id || item.state_id || item.district_id}
                      value={item.name}
                    >
                      {item.name}
                    </SelectItem>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-2">
                    {search ? "No results found" : "No options available"}
                  </p>
                )}
              </SelectContent>
            )}
        </Select>

        {/* Loading spinner */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  );
}

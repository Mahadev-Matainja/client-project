"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown } from "lucide-react";

const MONTHS = [
  { name: "January", value: "01" },
  { name: "February", value: "02" },
  { name: "March", value: "03" },
  { name: "April", value: "04" },
  { name: "May", value: "05" },
  { name: "June", value: "06" },
  { name: "July", value: "07" },
  { name: "August", value: "08" },
  { name: "September", value: "09" },
  { name: "October", value: "10" },
  { name: "November", value: "11" },
  { name: "December", value: "12" },
];

// Debounce helper
const useDebounce = (value: string, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
};

interface MonthDropdownProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

const MonthDropdown = ({
  value,
  onChange,
  disabled,
  error,
}: MonthDropdownProps) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  // Convert selected value (01) → display name (January)
  const selectedName =
    MONTHS.find((m) => m.value === value)?.name || "Select Month";

  const filteredList = useMemo(() => {
    return MONTHS.filter((m) =>
      m.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <div
          className={`w-full flex items-center justify-between border rounded-md px-3 py-2 bg-white cursor-pointer ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${error ? "border-red-500" : ""}`}
        >
          <span>{selectedName}</span>
          <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) p-2"
        align="start"
      >
        {/* Search field */}
        <Input
          placeholder="Search month..."
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />

        <ScrollArea className="max-h-60">
          {filteredList.length === 0 ? (
            <div className="px-2 py-1 text-sm text-gray-500">
              No results found
            </div>
          ) : (
            filteredList.map((month) => (
              <DropdownMenuItem
                key={month.value}
                onSelect={() => onChange(month.value)}
                className="cursor-pointer"
              >
                {month.name}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MonthDropdown;

"use client";

import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { State, District, City } from "@/services/EmergencyService";

const SearchDropdown = ({
  label,
  options,
  value,
  onChange,
  disabled,
  placeholder = `Select ${label}`,
}: any) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          disabled={disabled}
        >
          {value
            ? options.find((x: any) => String(x.id) === String(value))?.name
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Command>
          <CommandInput placeholder={`Search ${label}...`} />
          <CommandList>
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup>
              {options.map((item: any) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => onChange(String(item.id))}
                >
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const LocationDropdown = ({
  stateId = "",
  districtId = "",
  cityId = "",
  onChange,
}: any) => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedState, setSelectedState] = useState(stateId);
  const [selectedDistrict, setSelectedDistrict] = useState(districtId);
  const [selectedCity, setSelectedCity] = useState(cityId);

  // Load States
  useEffect(() => {
    State().then((res) => setStates(res));
  }, []);

  // Load Districts when State changes
  useEffect(() => {
    if (selectedState) {
      District(Number(selectedState)).then((res) => setDistricts(res));
    }
    setSelectedDistrict("");
    setSelectedCity("");
    setCities([]);
  }, [selectedState]);

  // Load Cities when District changes
  useEffect(() => {
    if (selectedDistrict) {
      City(Number(selectedDistrict)).then((res) => setCities(res));
    }
    setSelectedCity("");
  }, [selectedDistrict]);

  // Send to parent
  useEffect(() => {
    onChange?.(selectedState, selectedDistrict, selectedCity);
  }, [selectedState, selectedDistrict, selectedCity]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* STATE */}
      <SearchDropdown
        label="State"
        options={states}
        value={selectedState}
        onChange={setSelectedState}
      />

      {/* DISTRICT */}
      <SearchDropdown
        label="District"
        options={districts}
        value={selectedDistrict}
        onChange={setSelectedDistrict}
        disabled={!selectedState}
      />

      {/* CITY */}
      <SearchDropdown
        label="City"
        options={cities}
        value={selectedCity}
        onChange={setSelectedCity}
        disabled={!selectedDistrict}
      />
    </div>
  );
};

export default LocationDropdown;

"use client";

import SearchableDropdown from "@/components/SearchableDropdown";
import { City, District, State } from "@/services/EmergencyService";
import React, { useEffect, useState } from "react";

interface StateFilterProps {
  state_id?: string | number;
  district_id?: string | number;
  city_id?: string | number;
  onChange?: (stateId: string, districtId: string, cityId: string) => void;
}

const StateFilter: React.FC<StateFilterProps> = ({
  onChange,
  state_id,
  district_id,
  city_id,
}) => {
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Load initial states
  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const statesData = await State();
        setStates(statesData);
      } catch (error) {
        console.error("Failed to load states:", error);
      } finally {
        setLoadingStates(false);
      }
    };

    loadStates();
  }, []);

  // Initialize from props when states are loaded
  useEffect(() => {
    if (states.length === 0 || !state_id) return;

    const state = states.find((s) => String(s.state_id) === String(state_id));
    if (state) setSelectedState(state);
  }, [states, state_id]);

  // Load districts when state changes
  useEffect(() => {
    if (!selectedState) {
      setDistricts([]);
      setCities([]);
      return;
    }

    const loadDistricts = async () => {
      setLoadingDistricts(true);
      try {
        const districtsData = await District(selectedState.state_id);
        setDistricts(districtsData);

        // Initialize district if provided
        if (district_id) {
          const district = districtsData.find(
            (d: any) => String(d.district_id) === String(district_id)
          );
          if (district) setSelectedDistrict(district);
        }
      } catch (error) {
        console.error("Failed to load districts:", error);
      } finally {
        setLoadingDistricts(false);
      }
    };

    loadDistricts();
  }, [selectedState, district_id]);

  // Load cities when district changes
  useEffect(() => {
    if (!selectedDistrict) {
      setCities([]);
      return;
    }

    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const citiesData = await City(selectedDistrict.district_id);
        setCities(citiesData);

        // Initialize city if provided
        if (city_id) {
          const city = citiesData.find(
            (c: any) => String(c.id) === String(city_id)
          );
          if (city) setSelectedCity(city);
        }
      } catch (error) {
        console.error("Failed to load cities:", error);
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [selectedDistrict, city_id]);

  // Handle state selection
  const handleStateSelect = (stateName: string) => {
    const state = states.find((s) => s.name === stateName);
    if (!state) return;

    setSelectedState(state);
    setSelectedDistrict(null);
    setSelectedCity(null);
    setDistricts([]);
    setCities([]);

    onChange?.(String(state.state_id), "", "");
  };

  const handleDistrictSelect = (districtName: string) => {
    const district = districts.find((d) => d.name === districtName);
    if (!district) return;

    setSelectedDistrict(district);
    setSelectedCity(null);
    setCities([]);

    onChange?.(
      String(selectedState.state_id),
      String(district.district_id),
      ""
    );
  };

  const handleCitySelect = (cityName: string) => {
    // Handle clear
    if (!cityName) {
      setSelectedCity(null);
      onChange?.(
        selectedState ? String(selectedState.state_id) : "",
        selectedDistrict ? String(selectedDistrict.district_id) : "",
        ""
      );
      return;
    }

    // Find and set city
    const city = cities.find((c) => c.name === cityName);
    if (city) {
      setSelectedCity(city);
      onChange?.(
        String(selectedState.state_id),
        String(selectedDistrict.district_id),
        String(city.id)
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SearchableDropdown
        label="State"
        placeholder={loadingStates ? "Loading states..." : "Select State"}
        items={states}
        value={selectedState?.name || ""}
        onChange={handleStateSelect}
        loading={loadingStates}
      />

      <SearchableDropdown
        label="District"
        placeholder={
          loadingDistricts ? "Loading districts..." : "Select District"
        }
        items={districts}
        value={selectedDistrict?.name || ""}
        onChange={handleDistrictSelect}
        disabled={!selectedState || loadingDistricts}
        loading={loadingDistricts}
      />

      <SearchableDropdown
        label="City"
        placeholder={loadingCities ? "Loading cities..." : "Select City"}
        items={cities}
        value={selectedCity?.name || ""}
        onChange={handleCitySelect}
        disabled={!selectedDistrict || loadingCities}
        loading={loadingCities}
      />
    </div>
  );
};

export default StateFilter;

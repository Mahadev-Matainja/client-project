"use client";

import MainLayout from "@/components/layout/main-layout";
import { useEffect, useState } from "react";
import {
  State,
  District,
  City,
  AmbulanceDetails,
} from "@/services/EmergencyService";
import AmbulanceFilter from "./AmbulanceFilter";
import AmbulanceList from "./AmbulanceList";
import { Ambulance } from "lucide-react";

export default function OxygenPage() {
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [ambulanceData, setAmbulanceData] = useState<{ ambulances: any[] }>({
    ambulances: [],
  });

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [pinCode, setPinCode] = useState<string | null>(null);

  //  Load states
  useEffect(() => {
    (async () => {
      const data = await State();
      setStates(data);
    })();
  }, []);

  //  Load districts on state change
  useEffect(() => {
    if (!selectedState) return;

    (async () => {
      const stateObj = states.find((s: any) => s.name === selectedState);
      if (!stateObj) return;

      const data = await District(stateObj.state_id);
      setDistricts(data);
      setCities([]);
      setSelectedDistrict("");
      setSelectedCity("");
      setPinCode(null);
    })();
  }, [selectedState]);

  //  Load cities on district change
  useEffect(() => {
    if (!selectedDistrict) return;

    (async () => {
      const districtObj = districts.find(
        (d: any) => d.name === selectedDistrict
      );
      if (!districtObj) return;

      const data = await City(districtObj.district_id);
      setCities(data);
      setSelectedCity("");
      setPinCode(null);
    })();
  }, [selectedDistrict]);

  //  Search Button Click
  const handleSearch = async () => {
    const stateObj = states.find((s: any) => s.name === selectedState);
    const districtObj = districts.find((d: any) => d.name === selectedDistrict);
    const cityObj = cities.find((c: any) => c.name === selectedCity);

    const response = await AmbulanceDetails(
      stateObj?.state_id ?? null,
      districtObj?.district_id ?? null,
      cityObj?.id ?? null,
      pinCode ?? null
    );

    setAmbulanceData(response);
  };

  return (
    <MainLayout>
      <div className="px-6 py-8 relative">
        {/*  Back Button */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium hover:cursor-pointer"
        >
          ← Back
        </button>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold flex justify-center items-center gap-3 text-blue-700">
            <Ambulance size={40} />
            Find Ambulance Service
          </h1>
          <p className="text-gray-600 mt-2 text-lg max-w-2xl mx-auto">
            Choose an ambulance provider near you and contact immediately for
            emergency support.
          </p>
        </div>

        <AmbulanceFilter
          states={states}
          districts={districts}
          cities={cities}
          pinCode={pinCode}
          state={selectedState}
          district={selectedDistrict}
          city={selectedCity}
          onStateChange={setSelectedState}
          onDistrictChange={setSelectedDistrict}
          onCityChange={setSelectedCity}
          onPinCodeChange={setPinCode}
          onSearch={handleSearch}
        />

        <AmbulanceList ambulanceData={ambulanceData} />
      </div>
    </MainLayout>
  );
}

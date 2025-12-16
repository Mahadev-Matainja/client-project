"use client";

import MainLayout from "@/components/layout/main-layout";
import Image from "next/image";
import oxygenClynder from "@/public/icon/oxygenCylinder.png";
import { useEffect, useState } from "react";
import { FindOxygen, State, District, City } from "@/services/EmergencyService";
import OxygenFilters from "./OxygenFilters";
import OxygenList from "./OxygenList";

export default function OxygenPage() {
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [oxygenData, setOxygenData] = useState<any[]>([]);

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

    const fetchDistricts = async () => {
      const stateObj = states.find((s: any) => s.name === selectedState);
      if (!stateObj) return;

      const data = await District(stateObj.state_id);
      setDistricts(data);
      setCities([]);
      setSelectedDistrict("");
      setSelectedCity("");
      setPinCode(null);
    };

    fetchDistricts();
  }, [selectedState]);

  //  Load cities on district change
  useEffect(() => {
    if (!selectedDistrict) return;

    const fetchCities = async () => {
      const districtObj = districts.find(
        (d: any) => d.name === selectedDistrict
      );
      if (!districtObj) return;

      const data = await City(districtObj.district_id);
      setCities(data);
      setSelectedCity("");
      setPinCode(null);
    };

    fetchCities();
  }, [selectedDistrict]);

  //  Search Button Click
  const handleSearch = async () => {
    const stateObj = states.find((s: any) => s.name === selectedState);

    const districtObj = districts.find((d: any) => d.name === selectedDistrict);
    const cityObj = cities.find((c: any) => c.name === selectedCity);

    const response = await FindOxygen(
      stateObj?.state_id ?? null,
      districtObj?.district_id ?? null,
      cityObj?.id ?? null,
      pinCode ?? null
    );

    setOxygenData(response);
  };

  return (
    <MainLayout>
      <div className="px-6 py-8 relative">
        {/*  Back Button (Top Left) */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium hover:cursor-pointer"
        >
          ← Back
        </button>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold flex justify-center items-center gap-3 text-blue-700">
            <Image src={oxygenClynder} width={70} height={70} alt="oxygen" />
            Find Oxygen Service
          </h1>
          <p className="text-gray-600 mt-2 text-lg max-w-2xl mx-auto">
            Choose an oxygen provider near you and contact immediately for
            emergency support.
          </p>
        </div>

        <OxygenFilters
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

        <OxygenList oxygenData={oxygenData} />
      </div>
    </MainLayout>
  );
}

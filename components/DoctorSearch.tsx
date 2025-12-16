"use client";
import React, { useState } from "react";
import doctorIcon from "@/public/doctor-search/clinic.png";
import Image from "next/image";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedOption,
  setSearchText,
} from "@/lib/slices/doctorSearchSlice";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";

const DoctorSearch = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { selectedOption } = useSelector(
    (state: RootState) => state.doctorSearch
  );

  //  Local state only for input typing
  const [inputValue, setInputValue] = useState("");

  const handleSearch = () => {
    // Save search text to redux only when clicking search button
    dispatch(setSearchText(inputValue));

    //  Dynamic navigation based on selectedOption
    router.push(`/categories/${selectedOption.toLowerCase()}`);
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mx-auto mt-10 space-y-3">
        <h1 className="text-4xl font-extrabold">
          Need a doctor <span className="text-red-500">nearby</span>?
        </h1>
        <p className="text-gray-500 text-sm">
          Your health is our priority. Explore the best doctor’s schedule and
          clinics near you.
        </p>
      </div>

      {/* Search section */}
      <div className="w-full flex justify-center mt-10">
        <div className="flex items-center border rounded bg-white shadow-lg h-14 w-[90%] max-w-[700px] transition-all">
          {/* Dropdown */}
          <div className="flex items-center gap-2 p-2">
            <Image src={doctorIcon} alt="icon" width={26} height={26} />

            <select
              value={selectedOption}
              onChange={(e) => dispatch(setSelectedOption(e.target.value))} //  Store dropdown in Redux instantly
              className="bg-transparent text-sm outline-none font-medium cursor-pointer"
            >
              <option value="Doctor">Doctor</option>
              <option value="Clinic">Clinic</option>
            </select>
          </div>

          {/* Divider */}
          <div className="h-full w-[1px] bg-gray-300"></div>

          {/* Text Input */}
          <input
            type="text"
            placeholder={
              selectedOption === "Doctor"
                ? "Search by doctor name, specialty, location..."
                : "Search by clinic name, location..."
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} //  Only change local state
            className="flex-1 text-sm outline-none placeholder-gray-400 p-2"
          />

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-all hover:cursor-pointer"
          >
            <Search className="w-6 h-6" />
            Search
          </button>
        </div>
      </div>
    </>
  );
};

export default DoctorSearch;

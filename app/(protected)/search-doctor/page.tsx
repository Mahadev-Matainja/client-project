"use client";

import React, { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import DoctorSearch from "@/components/DoctorSearch";
import DoctorCarousel from "./components/DoctorCarousel";
import SpecialityList from "./components/SpecialityList";
import OtherspecialityList from "./components/OtherspecialityList";

const Page = () => {
  const [showSpecialities, setShowSpecialities] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleBack = () => {
    setShowSpecialities(false);
    setShowAll(false); // resets SpecialityList to initial UI (first 6 items)
  };

  return (
    <MainLayout>
      {/*  Show DoctorSearch + Carousel only when NOT showing specialities */}
      {!showSpecialities && (
        <>
          <DoctorSearch />
          <DoctorCarousel />
        </>
      )}

      {/*  Specialities Header + Back Btn */}
      {showSpecialities && (
        <div>
          <button
            onClick={handleBack}
            className="px-4 py-1.5 bg-gray-200 text-sm font-semibold rounded-lg hover:bg-gray-300 transition cursor-pointer"
          >
            ← Back
          </button>

          <div className="text-center mt-10 mb-6">
            <h1 className="text-5xl font-bold">
              <span className="text-red-600">40+</span> Specialities
            </h1>
            <p className="text-gray-600 mt-4 font-semibold text-xl">
              View the top doctors across specialities
            </p>
          </div>
        </div>
      )}

      {/*  Pass both states to SpecialityList */}
      <SpecialityList
        showAll={showAll}
        setShowAll={setShowAll}
        setShowSpecialities={setShowSpecialities}
      />
      <OtherspecialityList
        showAll={showAll}
        setShowAll={setShowAll}
        setShowSpecialities={setShowSpecialities}
      />
    </MainLayout>
  );
};

export default Page;

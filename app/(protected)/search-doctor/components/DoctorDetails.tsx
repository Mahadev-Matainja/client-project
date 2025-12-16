"use client";

import { useState, useEffect } from "react";

const doctorData = [
  {
    id: 1,
    name: "Dr. Example One",
    speciality: "General Physician",
    qualification: "MBBS, MD",
    image: "/images/doctor1.png",
  },
  {
    id: 2,
    name: "Dr. Example Two",
    speciality: "General Physician",
    qualification: "MBBS, MD (Internal Medicine)",
    image: "/images/doctor2.png",
  },
  {
    id: 3,
    name: "Dr. Example Three",
    speciality: "General Physician",
    qualification: "MBBS, DNB",
    image: "/images/doctor3.png",
  },
  {
    id: 4,
    name: "Dr. Example Four",
    speciality: "General Physician",
    qualification: "MBBS, MD",
    image: "/images/doctor4.png",
  },
];

const DoctorList = () => {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">
        Find the perfect match for your care needs
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctorData.map((doc) => (
          <div
            key={doc.id}
            className="bg-blue-50 rounded-xl p-5 flex items-center shadow-sm hover:shadow-md transition"
          >
            <img
              src={doc.image}
              alt="doctor"
              className="w-20 h-20 rounded-full"
            />

            <div className="ml-4">
              <h3 className="text-lg font-semibold text-blue-900">
                {doc.name}
              </h3>
              <p className="text-gray-700">{doc.speciality}</p>
              {doc.qualification && (
                <p className="text-sm text-gray-600 mt-1 italic">
                  {doc.qualification}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;

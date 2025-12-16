"use client";

import { useState } from "react";
import { Search } from "lucide-react";

// ✅ Static JSON Data
const doctorsData = [
  {
    id: 1,
    name: "Dr. Tridip Protihar",
    specialization: "General Physician",
    degree: "MBBS, M.D, Gold Medalist",
    experience: "4 Years 9 Months",
    department: "General Physician",
    timings: [{ day: "Saturday", from: "5:00 PM", to: "6:00 PM" }],
  },
  {
    id: 2,
    name: "Dr. Sourav Bag",
    specialization: "General Physician",
    degree: "MBBS",
    experience: "",
    department: "General Physician",
    timings: [
      { day: "Sunday", from: "5:00 PM", to: "6:00 PM" },
      { day: "Tuesday", from: "9:00 AM", to: "10:00 AM" },
      { day: "Thursday", from: "8:00 PM", to: "9:00 PM" },
    ],
  },
];

// ✅ Component
export default function ClinicDoctors() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = doctorsData.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-blue-100 rounded">
      {/* Search Bar */}
      <div className="flex items-center bg-white rounded-md shadow-sm overflow-hidden mb-8">
        <input
          type="text"
          placeholder="Search doctor from clinic"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 focus:outline-none text-gray-700"
        />
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 hover:bg-blue-700 transition">
          <Search className="w-5 h-5" />
          Search
        </button>
      </div>

      {/* Doctor Cards */}
      <div className="space-y-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <h2 className="text-xl font-bold text-green-800">
                {doctor.name}
              </h2>
              <p className="text-gray-600">{doctor.specialization}</p>
              <p className="text-gray-800 font-semibold">{doctor.degree}</p>
              {doctor.experience && (
                <p className="text-gray-600">{doctor.experience}</p>
              )}
              <p className="text-gray-600">{doctor.department}</p>

              <div className="mt-4">
                <h3 className="font-semibold text-green-800 mb-2">Timings</h3>
                <div className="flex flex-wrap gap-3">
                  {doctor.timings.map((t, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 rounded-md px-4 py-2 text-center"
                    >
                      <p className="font-semibold text-gray-700">{t.day}</p>
                      <p className="text-sm text-gray-600">
                        {t.from} <span className="mx-1 text-gray-500">To</span>{" "}
                        {t.to}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No doctors found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";

export default function DoctorDropdownLoader() {
  const rows = Array.from({ length: 5 }); // number of shimmer rows

  return (
    <div className="max-h-64 overflow-auto">
      {rows.map((_, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            {/* Image */}
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />

            {/* Name & Degree */}
            <div className="flex flex-col gap-1">
              <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
              <div className="w-40 h-2 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Button placeholder */}
          <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

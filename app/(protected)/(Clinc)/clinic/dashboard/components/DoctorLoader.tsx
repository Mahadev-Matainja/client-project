"use client";

import React from "react";

export default function DoctorLoader() {
  const rows = Array.from({ length: 5 }); // 5 placeholder rows

  return (
    <tbody>
      {rows.map((_, idx) => (
        <tr key={idx} className="text-center">
          <td className="p-4">
            <div className="h-4 w-10 bg-gray-200 rounded animate-pulse mx-auto" />
          </td>
          <td className="p-4 flex justify-center">
            <div className="h-11 w-11 rounded-full bg-gray-200 animate-pulse" />
          </td>
          <td className="p-4">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto" />
          </td>
          <td className="p-4">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto" />
          </td>
          <td className="p-4">
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse mx-auto" />
          </td>
          <td className="p-4 flex justify-center gap-3">
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

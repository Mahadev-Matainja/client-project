"use client";

export default function AmbulanceSkeleton() {
  return (
    <div className="animate-pulse bg-white p-6 rounded-2xl shadow-lg border">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>

      <div className="h-4 bg-gray-300 rounded w-1/2 mt-4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3 mt-2"></div>

      <div className="h-10 bg-gray-200 rounded mt-4"></div>

      <div className="h-4 bg-gray-300 rounded w-full mt-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mt-2"></div>

      <div className="h-4 bg-gray-300 rounded w-1/3 mt-4"></div>
    </div>
  );
}

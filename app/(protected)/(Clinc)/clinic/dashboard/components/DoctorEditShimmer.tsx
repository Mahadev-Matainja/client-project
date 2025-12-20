"use client";

export default function DoctorEditShimmer() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Title shimmer */}
      <div className="w-1/3 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>

      {/* Table shimmer */}
      <div className="w-5/6 space-y-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="w-full h-8 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div>

      {/* Button shimmer */}
      <div className="mt-6 w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}

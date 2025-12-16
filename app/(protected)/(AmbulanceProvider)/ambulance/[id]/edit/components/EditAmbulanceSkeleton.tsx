"use client";

export default function EditAmbulanceShimmer() {
  return (
    <div className="w-[74%] mx-auto animate-pulse">
      <div className="space-y-6">
        {/* Card Container */}
        <div className="rounded-lg border shadow-sm bg-white">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex w-full">
              {/* LEFT SECTION */}
              <div className="basis-[62%] pr-4 space-y-6">
                {/* Ambulance Type */}
                <div className="flex items-start gap-4">
                  <div className="min-w-[140px] h-5 bg-gray-200 rounded mt-2"></div>
                  <div className="flex-1">
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>

                {/* Ambulance Name */}
                <div className="flex items-center gap-4">
                  <div className="min-w-[140px] h-5 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>

                {/* Ambulance Number */}
                <div className="flex items-center gap-4">
                  <div className="min-w-[140px] h-5 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>

                {/* Car Model */}
                <div className="flex items-center gap-4">
                  <div className="min-w-[140px] h-5 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="min-w-[140px] h-5 bg-gray-200 rounded mt-2"></div>
                  <div className="flex-1">
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>

                {/* Alt Phone */}
                <div className="flex items-start gap-4">
                  <div className="min-w-[140px] h-5 bg-gray-200 rounded mt-2"></div>
                  <div className="flex-1">
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>

                {/* Pincode */}
                <div className="flex items-start gap-4">
                  <div className="min-w-[140px] h-5 bg-gray-200 rounded mt-2"></div>
                  <div className="flex-1">
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="min-w-[140px] h-5 bg-gray-200 rounded mt-2"></div>
                  <div className="flex-1">
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>

                {/* Map */}
                <div className="pt-2">
                  <div className="w-full h-64 bg-gray-200 rounded-md"></div>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="w-px bg-gray-200 mx-4"></div>

              {/* RIGHT SECTION */}
              <div className="basis-[42%] pl-2">
                {/* Equipment Header */}
                <div className="mb-4">
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>

                {/* Equipment Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 13 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    </div>
                  ))}
                </div>

                {/* Image Upload */}
                <div className="mt-6 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="w-full h-36 bg-gray-200 rounded-lg"></div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center mt-8">
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

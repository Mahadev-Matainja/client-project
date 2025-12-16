"use client";

import { Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import AmbulanceSkeleton from "../ambulance/AmbulanceSkeleton";

export default function OxygenList({ oxygenData }: any) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800); //  shimmer effect
  }, [oxygenData]);

  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <AmbulanceSkeleton key={i} />
        ))}
      </div>
    );
  }

  // If no oxygen found after loading finishes
  if (!oxygenData?.oxygen || oxygenData.oxygen.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-12">
        No oxygen suppliers found. Try changing your filters.
      </p>
    );
  }

  return (
    <div className="mt-6 border rounded-lg p-6 bg-white shadow-sm">
      <h3 className="text-lg font-bold mb-4 bg-blue-50 p-3 text-blue-700 rounded-md border border-blue-200 flex items-center gap-2">
        🏥 Available Oxygen Providers
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {oxygenData.oxygen.map((o: any) => (
          <div
            key={o.id}
            className="bg-white p-6 rounded-2xl shadow-lg border hover:shadow-2xl hover:scale-[1.02] transition"
          >
            <p className="font-bold text-lg">{o.shop_name}</p>
            <p className="text-sm text-gray-500 flex mt-1 gap-2">
              <User size={16} />
              {o.owner_name}
            </p>

            <p className="text-blue-600 mt-3 flex items-center gap-2 font-medium">
              <Phone size={18} /> {o.phone_primary} / {o.phone_secondary}
            </p>

            {o.email && (
              <p className="text-indigo-600 underline flex items-center gap-2 mt-3 text-sm cursor-pointer">
                <Mail size={16} /> {o.email}
              </p>
            )}

            <div className="mt-4 bg-gray-50 rounded-md">
              <p className="flex items-start gap-2 text-gray-700 text-sm">
                <MapPin size={22} className="mt-1 text-red-600" />
                {o.address_line1}, {o.address_line2}
                <br />
                {o.city_name} ({o.pincode})
              </p>
            </div>

            <p className="text-md flex mt-1 gap-2">
              Landmark: <b>{o.landmark}</b>
            </p>

            <p className="text-xs text-gray-500 mt-2">
              License No: <b>{o.license_no}</b>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

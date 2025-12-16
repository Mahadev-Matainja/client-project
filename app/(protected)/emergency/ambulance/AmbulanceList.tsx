"use client";

import { Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import AmbulanceSkeleton from "./AmbulanceSkeleton"; //  import skeleton

interface Ambulance {
  id: number;
  owner_name: string;
  ambulance_name: string;
  ambulance_no: string;
  phone: string;
  alternative_phone?: string;
  email?: string;
  address_line1: string;
  address_line2?: string;
  city_name: string;
  pincode: string;
  is_available: number;
  car_model?: string;
  type_name: string;
}

interface AmbulanceDataProps {
  ambulanceData: {
    ambulances: Ambulance[];
  };
}

export default function AmbulanceList({ ambulanceData }: AmbulanceDataProps) {
  const [selectedType, setSelectedType] = useState<string>("All");
  const [filteredAmbulances, setFilteredAmbulances] = useState<Ambulance[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (!ambulanceData?.ambulances) return;

    const list = ambulanceData.ambulances;
    const dynamicTypes = [
      "All",
      ...new Set(list.map((item) => item.type_name)),
    ];

    setTypes(dynamicTypes);
    setFilteredAmbulances(list);

    setTimeout(() => setLoading(false), 800);
  }, [ambulanceData]);

  useEffect(() => {
    if (!ambulanceData?.ambulances) return;

    const result =
      selectedType === "All"
        ? ambulanceData.ambulances
        : ambulanceData.ambulances.filter(
            (amb) => amb.type_name === selectedType
          );

    setFilteredAmbulances(result);
  }, [selectedType, ambulanceData]);

  return (
    <>
      {loading ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <AmbulanceSkeleton key={index} />
          ))}
        </div>
      ) : filteredAmbulances.length === 0 ? (
        <p className="text-center text-gray-500 mt-12">
          No ambulance providers found. Try changing your filters.
        </p>
      ) : (
        <>
          {/* Ambulance Type Filter Buttons */}
          <div className="flex justify-center gap-4 mt-10 flex-wrap">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition cursor-pointer ${
                  selectedType === type
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-blue-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Ambulance Cards */}
          <div className="mt-6 border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-lg font-bold mb-4 bg-blue-50 p-3 text-blue-700 rounded-md border border-blue-200 flex items-center gap-2">
              🚑 Available Providers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAmbulances.map((o) => (
                <div
                  key={o.id}
                  className="relative bg-white p-6 rounded-2xl shadow-lg border hover:shadow-2xl hover:scale-[1.02] transition"
                >
                  {/* ✅ STATUS BADGE ABSOLUTE POSITION */}
                  <p
                    className={`absolute top-0 right-[0px] p-[2px]  rounded-bl-[16px] ${
                      o.is_available
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {o.is_available ? (
                      <span className="p-2 text-xs">Available</span>
                    ) : (
                      <span className="p-2 text-xs">Not Available</span>
                    )}
                  </p>

                  <p className="font-bold text-lg">{o.ambulance_name}</p>

                  <p className="text-sm text-gray-500 flex mt-1 gap-2">
                    <User size={16} />
                    {o.owner_name}
                  </p>

                  <p className="text-blue-600 mt-3 flex items-center gap-2 font-medium">
                    <Phone size={18} /> {o.phone}
                    {o.alternative_phone && ` / ${o.alternative_phone}`}
                  </p>

                  {o.email && (
                    <p className="text-indigo-600 underline flex items-center gap-2 mt-3 text-sm cursor-pointer">
                      <Mail size={16} /> {o.email}
                    </p>
                  )}

                  <div className="mt-4 bg-gray-50 rounded-md ">
                    <p className="flex items-start gap-2 text-gray-700 text-sm">
                      <MapPin size={18} className="mt-1 text-red-600" />
                      {o.address_line1}
                      {o.address_line2 && `, ${o.address_line2}`}
                      <br />
                      {o.city_name} ({o.pincode})
                    </p>
                  </div>

                  <p className="text-md mt-2">
                    Ambulance No: <b>{o.ambulance_no}</b>
                  </p>

                  {o.car_model && (
                    <p className="text-xs text-gray-500 mt-2">
                      Car Model: <b>{o.car_model}</b>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

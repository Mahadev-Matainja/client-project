"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, MapPin, Copy } from "lucide-react";
import MainLayout from "@/components/layout/main-layout";
import ClinicDoctors from "./components/ClinicDoctors";

const storeData = {
  name: "Ma Medical",
  address: "Mizapur, West Bengal 712409, India",
  phones: ["8479085564", "9163143457"],
  image: "/store.png",
  specialties: [
    { id: 1, name: "All", image: "/doctor-category/Psychiatrist.png" },
    {
      id: 2,
      name: "General Physician",
      image: "/doctor-category/General Physician.png",
    },
    { id: 3, name: "Gynecologist", image: "/doctor-category/Gynecologist.jpg" },
    {
      id: 4,
      name: "Dermatologists",
      image: "/doctor-category/Dermatologists.png",
    },
    { id: 5, name: "Orthopedic", image: "/doctor-category/Orthopedic.png" },
    { id: 6, name: "Neurologist", image: "/doctor-category/Neurologist.png" },
    { id: 7, name: "ENT", image: "/doctor-category/ENT.png" },
    {
      id: 8,
      name: "Orthopedic surgeon",
      image: "/doctor-category/Orthopedic.png",
    },
    { id: 9, name: "Psychiatrist", image: "/doctor-category/psychiatrist.png" },
    {
      id: 10,
      name: "Sugar and Thyroid",
      image: "/doctor-category/Sugar_and_ Thyroid.png",
    },
  ],
};

export default function MedicalStorePage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (phone: string, index: number) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500); // tooltip hides after 1.5s
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-6 font-sans">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="bg-[#ceeaf2] rounded-2xl p-2.5 flex flex-col items-center w-full md:w-1/5">
            <Image
              src={"/icon/madicalhall-default.jpg"}
              alt={storeData.name}
              width={200}
              height={200}
              className="rounded-lg"
            />
            <button className="mt-3 flex items-center gap-2 text-green-700 font-medium cursor-pointer">
              <MapPin className="w-4 h-4" />
              Get direction
            </button>
          </div>

          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold text-green-800">
              {storeData.name}
            </h1>
            <p className="text-gray-700 font-semibold">{storeData.address}</p>

            {/* Contact */}
            <div className="mt-3 space-y-2">
              {storeData.phones.map((phone, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-green-700 relative"
                >
                  <Image
                    src={"/icon/WhatsApp_icon.png"}
                    alt="whatsapp"
                    width={25}
                    height={25}
                    className="rounded-lg"
                  />
                  <a
                    href={`https://wa.me/${phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-medium"
                  >
                    {phone}
                  </a>

                  {/*  Copy Icon with Tooltip */}
                  <div className="relative group cursor-pointer">
                    <Copy
                      onClick={() => handleCopy(phone, i)}
                      className="w-5 h-5 text-gray-700 hover:text-green-800 transition"
                    />
                    <span
                      className={`absolute left-1/2 -translate-x-1/2 -top-7 text-xs p-1 mt-2 ml-7 rounded-md text-white ${
                        copiedIndex === i
                          ? "bg-green-700 opacity-100"
                          : "bg-gray-800 opacity-0 group-hover:opacity-100"
                      } transition-opacity duration-200`}
                    >
                      {copiedIndex === i ? "Copied!" : "Copy"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 uppercase tracking-widest text-sm text-gray-800 font-bold">
              About Store
            </p>
          </div>
        </div>

        {/* Specialties */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-green-800 mb-2">
            Top Specialties
          </h2>
          <div className="w-40 h-1 bg-green-700 rounded mb-6"></div>

          <div className="mt-4 p-4 bg-[#e2edeb78] rounded">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
              {storeData.specialties.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center text-center bg-white p-4 rounded-xl shadow-md border transition-all cursor-pointer hover:scale-[1.03] hover:shadow-xl hover:bg-gradient-to-br hover:from-[rgba(192,223,230,0.5)] hover:to-[rgba(255,255,255,0.7)]"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="mb-2"
                  />
                  <p className="text-sm font-medium text-gray-700">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ClinicDoctors />
    </MainLayout>
  );
}

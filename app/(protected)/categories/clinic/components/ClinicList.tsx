"use client";

import { Phone, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ClinicList() {
  const router = useRouter();
  //  JSON data on the same page
  const medicalStores = [
    {
      id: 1,
      name: "Ma Medical",
      address: "mizapur, West Bengal 712409, India",
      phone: "8479085564",
      whatsapp: "9163143457",
      location: "https://maps.google.com/?q=mizapur, West Bengal 712409",
    },
    {
      id: 2,
      name: "Das Medical Store",
      address: "Kamarkundu, near kamarkundu Club, West Bengal, India",
      phone: "9007760027",
      whatsapp: "9830767518",
      location: "https://maps.google.com/?q=Kamarkundu, West Bengal",
    },
    {
      id: 3,
      name: "Pal Medical",
      address: "Gopingagar, West Bengal 712405, India",
      phone: "9732925234",
      whatsapp: "03212239326",
      location: "https://maps.google.com/?q=Gopingagar, West Bengal 712405",
    },
    {
      id: 4,
      name: "Das Medical Stores",
      address: "Baruipara, West Bengal 712306, India",
      phone: "8420712029",
      whatsapp: "8420712029",
      location: "https://maps.google.com/?q=Baruipara, West Bengal 712306",
    },
    {
      id: 5,
      name: "Ma Medical Store",
      address: "Nasibpur Nanda, West Bengal 712124, India",
      phone: "8777792731",
      whatsapp: "8777792731",
      location: "https://maps.google.com/?q=Nasibpur Nanda, West Bengal 712124",
    },
    {
      id: 6,
      name: "M K Medical",
      address: "Nandi Gali, SehakhalA, West Bengal 712706, India",
      phone: "9932588328",
      whatsapp: "9932588328",
      location: "https://maps.google.com/?q=SehakhalA, West Bengal 712706",
    },
    {
      id: 7,
      name: "Modern Medical Hall",
      address: "Kamarkundu, West Bengal, India",
      phone: "8420363098",
      whatsapp: "9748029729",
      location: "https://maps.google.com/?q=Kamarkundu, West Bengal",
    },
    {
      id: 8,
      name: "New Medical Hall",
      address: "Baruipara, West Bengal 712306, India",
      phone: "9874315346",
      whatsapp: "9874315346",
      location: "https://maps.google.com/?q=Baruipara, West Bengal 712306",
    },
  ];

  return (
    <div className="mt-8 p-4 bg-[#e2edeb78] rounded-md">
      <h2 className="text-xl font-semibold text-center mb-8 ">
        Choose from the Best Healthcare Providers
      </h2>
      <hr className="bg-gray-500 h-0.5 my-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {medicalStores.map((store) => (
          <div
            key={store.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-[#D3EEF7] cursor-pointer"
            onClick={() => router.push("/categories/clinicDetails")}
          >
            <h3 className="text-lg font-semibold mb-2">{store.name}</h3>
            <p className="text-gray-700 mb-4">{store.address}</p>

            <div className="flex items-center gap-4 flex-wrap">
              {/* Phone */}
              <a
                href={`tel:${store.phone}`}
                className="flex items-center gap-2"
              >
                <Phone size={18} />
                <span>{store.phone}</span>
              </a>

              {/* Whatsapp */}
              <a
                href={`https://wa.me/91${store.whatsapp}`}
                target="_blank"
                className="flex items-center gap-2 text-green-600"
              >
                <Image
                  src={"/icon/WhatsApp_icon.png"}
                  alt="whatsapp"
                  width={25}
                  height={25}
                  className="rounded-lg"
                />
                <span>{store.whatsapp}</span>
              </a>

              {/* Get Direction */}
              <a
                href={store.location}
                target="_blank"
                className="flex items-center gap-2 text-green-600 font-medium"
              >
                <MapPin size={18} />
                Get direction
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

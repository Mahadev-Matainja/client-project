"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Ambulance } from "lucide-react";
import oxygenClynder from "@/public/icon/oxygenClynder.png"; // ✅ Static image
import MainLayout from "@/components/layout/main-layout";

export default function EmergencyPage() {
  const router = useRouter();

  return (
    <MainLayout>
      <main className="min-h-[calc(90vh-40px)] bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-10">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight text-gray-900">
            Emergency Services
          </h1>

          <p className="text-gray-600 mb-14 text-lg">
            Select the type of emergency service you want to manage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {/* 🚑 Ambulance */}
            <div
              className="relative group p-10 rounded-3xl shadow-xl bg-white hover:bg-blue-600 transition-all duration-300 cursor-pointer hover:scale-[1.03] border border-gray-100 hover:border-blue-600"
              onClick={() => router.push("/emergency/ambulance")}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-blue-100 rounded-full p-6 group-hover:bg-blue-500 transition">
                  <Ambulance className="h-16 w-16 text-blue-600 group-hover:text-white transition" />
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-white transition">
                  Ambulance
                </h2>

                <p className="text-gray-500 group-hover:text-gray-200 transition text-sm">
                  View and manage ambulance services
                </p>
              </div>
            </div>

            {/* 🟦 Oxygen */}
            <div
              className="relative group p-10 rounded-3xl shadow-xl bg-white hover:bg-green-600 transition-all duration-300 cursor-pointer hover:scale-[1.03] border border-gray-100 hover:border-green-600"
              onClick={() => router.push("/emergency/oxygen")}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-green-100 rounded-full p-6 group-hover:bg-green-500 transition">
                  <Image
                    src={oxygenClynder}
                    alt="oxygen cylinder"
                    className="h-16 w-16 transition group-hover:brightness-100 group-hover:invert"
                  />
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-white transition">
                  Oxygen
                </h2>

                <p className="text-gray-500 group-hover:text-gray-200 transition text-sm">
                  Manage oxygen availability
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}

"use client";

import Image from "next/image";
import { Trash2, Pencil, Plus, Hospital } from "lucide-react";
import { useState } from "react";
import AddDoctorDrawer from "./components/AddDoctorDrawer";
import MainLayout from "@/components/layout/main-layout";
import EditDoctorDrawer from "./components/EditDoctorDrawer";

export default function DoctorsPage() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);

  return (
    <MainLayout>
      {" "}
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setOpenDrawer(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg cursor-pointer"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-blue-900 font-semibold">
                <th className="p-4">Doctor Id</th>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Specialist</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="p-4">4794</td>
                <td className="p-4 flex justify-center">
                  <Image
                    src="/icon/Doctor.png"
                    alt="doctor"
                    width={44}
                    height={44}
                    className="rounded-full"
                  />
                </td>
                <td className="p-4 text-blue-700">Dr. Basab Mondal</td>
                <td className="p-4">Dental Surgeon</td>
                <td className="p-4">
                  <input
                    className="w-20 border rounded px-2 py-1"
                    defaultValue={1}
                  />
                </td>
                {/* Action */}
                <td className="p-4 flex justify-center gap-3">
                  {/* Delete */}
                  <div className="relative group">
                    <button className="bg-red-600 p-2 rounded text-white cursor-pointer">
                      <Trash2 size={14} />
                    </button>

                    <span
                      className="absolute top-full mt-2 left-1/2 -translate-x-1/2
                 whitespace-nowrap text-xs text-white bg-black
                 px-2 py-1 rounded opacity-0
                 group-hover:opacity-100 transition"
                    >
                      Delete
                    </span>
                  </div>

                  {/* Add Schedule */}
                  <div className="relative group">
                    <button
                      onClick={() => setOpenEditDrawer(true)}
                      className="bg-red-600 p-2 rounded text-white cursor-pointer"
                    >
                      <Hospital size={14} />
                    </button>

                    <span
                      className="absolute top-full mt-2 left-1/2 -translate-x-1/2
                 whitespace-nowrap text-xs text-white bg-black
                 px-2 py-1 rounded opacity-0
                 group-hover:opacity-100 transition"
                    >
                      Add Schedule
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Drawer */}
        <AddDoctorDrawer
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        />

        <EditDoctorDrawer
          open={openEditDrawer}
          onClose={() => setOpenEditDrawer(false)}
        />
      </div>
    </MainLayout>
  );
}

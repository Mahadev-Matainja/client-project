"use client";

import React, { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Doctor } from "@/@types/doctor";
import SearchBar from "./components/SearchBar";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import AddDoctorButton from "./components/AddDoctorButton";
import DoctorTable from "./components/DoctorTable";

export default function DoctorListPage() {
  const router = useRouter();

  // ✅ Static JSON data for doctors
  const [data, setData] = useState<Doctor[]>([
    {
      id: 1,
      name: "Dr. Amit Sharma",
      image: "/doctor-1.jpg",
      specialist: "Cardiologist",
      priority: 1,
      status: "Online",
      qualification: "MD, DM Cardiology",
    },
    {
      id: 2,
      name: "Dr. Neha Verma",
      image: "/doctor-2.jpg",
      specialist: "Neurologist",
      priority: 2,
      status: "Online",
      qualification: "MD, DM Neurology",
    },
    {
      id: 3,
      name: "Dr. Rahul Singh",
      image: "/doctor-3.jpg",
      specialist: "Orthopedic",
      priority: 3,
      status: "Offline",
      qualification: "MS Orthopedics",
    },
    {
      id: 4,
      name: "Dr. Priya Patel",
      image: "/doctor-4.jpg",
      specialist: "Pediatrician",
      priority: 4,
      status: "Online",
      qualification: "MD Pediatrics",
    },
    {
      id: 5,
      name: "Dr. Sanjay Gupta",
      image: "/doctor-5.jpg",
      specialist: "Dermatologist",
      priority: 5,
      status: "Online",
      qualification: "MD Dermatology",
    },
  ]);

  const [search, setSearch] = useState("");
  const [loading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState<Doctor | null>(null);

  // ✅ Search filter
  const filteredData = data.filter((doctor) => {
    const query = search.toLowerCase();

    return (
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialist.toLowerCase().includes(query) ||
      doctor.qualification?.toLowerCase().includes(query) ||
      doctor.priority.toString().includes(query) //  number safe
    );
  });

  const handleDeleteClick = (doctor: Doctor) => {
    setSelectedDelete(doctor);
    setDeleteOpen(true);
  };

  // ✅ Local delete (no API)
  const confirmDelete = () => {
    if (selectedDelete) {
      setData((prev) => prev.filter((x) => x.id !== selectedDelete.id));

      toast({
        title: "Doctor deleted successfully",
        description: `${selectedDelete.name} has been removed from the list`,
      });

      setDeleteOpen(false);
      setSelectedDelete(null);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor List</h1>
            <p className="text-gray-600 mt-1">
              Manage all doctors in the clinic
            </p>
          </div>

          <AddDoctorButton />
        </div>

        {/* Search */}
        <div>
          <SearchBar search={search} setSearch={setSearch} />
        </div>

        {/* Table */}
        <DoctorTable
          data={filteredData}
          loading={loading}
          onEdit={(doctor) => router.push(`/clinic/${doctor.id}/edit`)}
          onDelete={handleDeleteClick}
        />

        {/* Delete Dialog */}
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onDelete={confirmDelete}
          name={selectedDelete?.name}
        />
      </div>
    </MainLayout>
  );
}

"use client";

import Image from "next/image";
import { Trash2, Hospital, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import AddDoctorDrawer from "./components/AddDoctorDrawer";
import EditDoctorDrawer from "./components/EditDoctorDrawer";
import DoctorLoader from "./components/DoctorLoader";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import { ClinicDoctorList, ClinicDoctorDelete } from "@/services/ClinicService";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function DoctorsPage() {
  const doctorList = useSelector(
    (state: RootState) => state.clinicDoctors.list
  );

  console.log("Redux clinicDoctors state:", doctorList);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDoctorId, setCurrentDoctorId] = useState<number | null>(null);

  const [selectedDoctors, setSelectedDoctors] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [search, setSearch] = useState("");

  // Delete modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await ClinicDoctorList();
        setDoctors(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  //redux data syncs

  useEffect(() => {
    if (doctorList.length === 0) return;

    setDoctors((prev) => {
      // avoid duplicates by ID
      const existingIds = new Set(prev.map((d) => d.id));
      const newDoctors = doctorList.filter((d) => !existingIds.has(d.id));

      return [...newDoctors, ...prev]; // new ones on top
    });
  }, [doctorList]);

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace("/api", "") || "";

  // Select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDoctors([]);
    } else {
      setSelectedDoctors(doctors.map((d) => d.id));
    }
    setSelectAll(!selectAll);
  };

  // Select single
  const handleSelectDoctor = (id: number) => {
    setSelectedDoctors((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Filter
  const filteredDoctors = doctors.filter((doctor) => {
    const term = search.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(term) ||
      doctor.specialist.toLowerCase().includes(term) ||
      doctor.id.toString().includes(term)
    );
  });

  // Open modal (single)
  const handleDelete = (id: number) => {
    setDeleteIds([id]);
    setConfirmOpen(true);
  };

  // Open modal (bulk)
  const handleBulkDelete = () => {
    setDeleteIds(selectedDoctors);
    setConfirmOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);

      await ClinicDoctorDelete(deleteIds);

      setDoctors((prev) =>
        prev.filter((doctor) => !deleteIds.includes(doctor.id))
      );

      setSelectedDoctors([]);
      setSelectAll(false);

      console.log({ rows: deleteIds });
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setDeleteLoading(false);
      setConfirmOpen(false);
      setDeleteIds([]);
    }
  };

  return (
    <MainLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search doctors..."
            className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-3">
            {selectedDoctors.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Delete All ({selectedDoctors.length})
              </button>
            )}

            <button
              onClick={() => setOpenDrawer(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg cursor-pointer"
            >
              <Plus size={16} />
              Add Doctor
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b font-semibold text-blue-900">
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-4">Doctor ID</th>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Specialist</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            {loading ? (
              <DoctorLoader />
            ) : filteredDoctors.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No data found
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="text-center">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedDoctors.includes(doctor.id)}
                        onChange={() => handleSelectDoctor(doctor.id)}
                      />
                    </td>
                    <td className="p-4">{doctor.doctor_id}</td>
                    <td className="p-4 flex justify-center">
                      <Image
                        src={
                          doctor.image
                            ? `${BASE_URL}/${doctor.image}`
                            : "/icon/Doctor.png"
                        }
                        alt="doctor"
                        width={44}
                        height={44}
                        className="rounded-full"
                      />
                    </td>
                    <td className="p-4">
                      <p className="text-blue-700 font-medium">{doctor.name}</p>
                      {doctor.qualification && (
                        <p className="text-xs text-gray-500">
                          {doctor.qualification}
                        </p>
                      )}
                    </td>
                    <td className="p-4">{doctor.specialist}</td>
                    <td className="p-4">
                      <input
                        className="w-20 border rounded px-2 py-1"
                        defaultValue={doctor.priority}
                      />
                    </td>
                    <td className="p-4 flex justify-center gap-3">
                      <button
                        onClick={() => handleDelete(doctor.id)}
                        className="bg-red-600 p-2 rounded text-white cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>

                      <button
                        onClick={() => {
                          setCurrentDoctorId(doctor.doctor_id); // save the doctor ID
                          setOpenEditDrawer(true); // open the drawer
                        }}
                        className="bg-red-600 p-2 rounded text-white cursor-pointer"
                      >
                        <Hospital size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Drawers */}
        <AddDoctorDrawer
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        />
        <EditDoctorDrawer
          open={openEditDrawer}
          onClose={() => {
            setOpenEditDrawer(false);
            setCurrentDoctorId(null); // reset when drawer closes
          }}
          doctorId={currentDoctorId} // <-- pass doctor ID
        />

        {/* Confirm Modal */}
        <ConfirmDeleteModal
          open={confirmOpen}
          title="Delete Doctor(s)"
          description={`Are you sure you want to delete ${deleteIds.length} doctor(s)? This action cannot be undone.`}
          loading={deleteLoading}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </MainLayout>
  );
}

"use client";

import { ClinicDoctorAdd, DoctorAdd } from "@/services/ClinicService";
import { X, ChevronDown, Search, Plus, Check } from "lucide-react";
import { useEffect, useState } from "react";
import DoctorDropdownLoader from "./DoctorDropdownLoader";
import { toast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { addDoctors } from "@/lib/slices/clinicDoctorsSlice";

interface Props {
  open: boolean;
  onClose: () => void;
}

/* ================== COMPONENT ================== */
export default function AddDoctorDrawer({ open, onClose }: Props) {
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDoctors, setSelectedDoctors] = useState<number[]>([]);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      const debounce = setTimeout(async () => {
        try {
          const res = await ClinicDoctorAdd(search);
          setDoctorsList(res.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }, 300);

      // cleanup previous timer
      return () => clearTimeout(debounce);
    } else {
      // reset when drawer closes
      setSelectedDoctors([]);
      setSearch("");
      setOpenDropdown(false);
    }
  }, [open, search]);

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace("/api", "") || "";
  /* ----------- ACTIONS ----------- */
  const addDoctor = (id: number) => {
    setSelectedDoctors((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeDoctor = (id: number) => {
    setSelectedDoctors((prev) => prev.filter((d) => d !== id));
  };

  const filteredDoctors = doctorsList.filter((d) => {
    const name = d.name?.toLowerCase() || "";
    const specialization = d.specialization?.toLowerCase() || "";
    const searchLower = search.toLowerCase();

    return name.includes(searchLower) || specialization.includes(searchLower);
  });

  const handleSaveDoctors = async () => {
    const doctor_ids = doctorsList
      .filter((d) => selectedDoctors.includes(d.id))
      .map((d) => d.id);

    if (doctor_ids.length === 0) {
      toast({
        title: "No doctor selected",
        description: "Please select at least one doctor.",
        variant: "destructive",
      });
      return;
    }

    const payload = { doctor_ids };

    try {
      setSaving(true); // ✅ start loading
      const res = await DoctorAdd(payload);

      dispatch(addDoctors(res.data));

      if (res?.success) {
        toast({
          title: "Updated Successfully 🎉",
          description: res?.message || "Doctors have been added successfully.",
        });
        setSelectedDoctors([]);
        onClose();
      } else {
        toast({
          title: "Info",
          description: res?.message || "No changes were made.",
          variant: "default",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to save doctors";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      console.error("Save doctors failed", error);
    } finally {
      setSaving(false); // ✅ stop loading
    }
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40" />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[470px] bg-white z-50 overflow-y-auto
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Add Doctor</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Doctor Select */}
          <div>
            <label className="text-sm font-medium">Select Doctors</label>

            {/* Selected Doctors */}

            {selectedDoctors.length > 0 && (
              <div
                onClick={() => setOpenDropdown(!openDropdown)}
                className="mt-1 border rounded-md px-3 py-2 flex flex-wrap gap-2 cursor-pointer min-h-[48px]"
              >
                {doctorsList
                  .filter((d) => selectedDoctors.includes(d.id))
                  .map((doc) => (
                    <span
                      key={doc.id}
                      className="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded-full text-xs"
                    >
                      <img
                        src={
                          doc.image
                            ? `${BASE_URL}/${doc.image}`
                            : "/icon/Doctor.png"
                        }
                        className="w-5 h-5 rounded-full"
                      />

                      {doc.name}

                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDoctor(doc.id);
                        }}
                        className="hover:text-red-800 text-red-700 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
              </div>
            )}

            {/* Dropdown */}

            <div className="mt-2 border rounded-lg shadow-lg overflow-hidden">
              {/* Search */}
              <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-50">
                <Search size={16} className="text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search doctor or specialization..."
                  className="w-full outline-none text-sm bg-transparent h-[26px]"
                />
              </div>

              {/* Doctor List */}
              <div className="max-h-96 overflow-auto">
                {loading ? (
                  <DoctorDropdownLoader />
                ) : filteredDoctors.length === 0 ? (
                  <p className="text-center text-gray-500 py-4 text-sm">
                    No doctor found
                  </p>
                ) : (
                  filteredDoctors.map((doctor) => {
                    const selected = selectedDoctors.includes(doctor.id);

                    return (
                      <div
                        key={doctor.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              doctor.image
                                ? `${BASE_URL}/${doctor.image}`
                                : "/icon/Doctor.png"
                            }
                            className="w-10 h-10 rounded-full object-cover"
                          />

                          <div>
                            <p className="font-medium">{doctor.name}</p>
                            <p className="text-xs text-gray-500">
                              {doctor.degree} • {doctor.specialist}
                            </p>
                          </div>
                        </div>

                        {/* Add / Added */}
                        <button
                          disabled={selected}
                          onClick={() => addDoctor(doctor.id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm
              ${
                selected
                  ? "bg-green-100 text-green-600 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              }`}
                        >
                          {selected ? (
                            <>
                              <Check size={14} /> Added
                            </>
                          ) : (
                            <>
                              <Plus size={14} /> Add
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6">
            <button onClick={onClose} className="px-4 py-2 border rounded-md">
              Cancel
            </button>

            <button
              disabled={selectedDoctors.length === 0 || saving}
              onClick={handleSaveDoctors}
              className={`px-6 py-2 rounded-md text-white transition-colors
    ${
      selectedDoctors.length === 0 || saving
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-red-600 hover:bg-red-700"
    }`}
            >
              {saving ? "Saving..." : "Save Doctors"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

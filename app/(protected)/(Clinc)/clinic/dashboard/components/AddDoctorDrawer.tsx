"use client";

import { X, ChevronDown } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const doctorsList = [
  "Dr. Basab Mondal",
  "Dr. Rahul Sharma",
  "Dr. Ananya Sen",
  "Dr. Priya Das",
];

export default function AddDoctorDrawer({ open, onClose }: Props) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);

  const toggleDoctor = (doctor: string) => {
    setSelectedDoctors((prev) =>
      prev.includes(doctor)
        ? prev.filter((d) => d !== doctor)
        : [...prev, doctor]
    );
  };

  const isSaveDisabled = selectedDoctors.length === 0;

  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40" />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[500px] bg-white z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Add Doctor</h2>
          <button onClick={onClose} className="cursor-pointer">
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Multi Select */}
          <div>
            <label className="text-sm font-medium">Select Doctors</label>

            <div
              onClick={() => setOpenDropdown(!openDropdown)}
              className="mt-1 border rounded-md px-3 py-2 flex justify-between cursor-pointer"
            >
              <div className="flex gap-2 flex-wrap">
                {selectedDoctors.length === 0 ? (
                  <span className="text-gray-400">Select doctors...</span>
                ) : (
                  selectedDoctors.map((doc) => (
                    <span
                      key={doc}
                      className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs"
                    >
                      {doc}
                    </span>
                  ))
                )}
              </div>
              <ChevronDown size={16} />
            </div>

            {openDropdown && (
              <div className="mt-1 border rounded-md shadow max-h-48 overflow-auto">
                {doctorsList.map((doctor) => (
                  <label
                    key={doctor}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDoctors.includes(doctor)}
                      onChange={() => toggleDoctor(doctor)}
                    />
                    {doctor}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md cursor-pointer"
            >
              Cancel
            </button>

            <button
              disabled={isSaveDisabled}
              className={`px-4 py-2 rounded-md text-white 
                ${
                  isSaveDisabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 cursor-pointer"
                }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Doctor } from "@/@types/doctor";
import DoctorRow from "./DoctorRows";

interface DoctorTableProps {
  data: Doctor[];
  loading: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

type SortField = "name" | "specialist" | "priority" | "status" | null;
type SortDirection = "asc" | "desc";

export default function DoctorTable({
  data,
  loading,
  onEdit,
  onDelete,
}: DoctorTableProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;

    let valueA: any, valueB: any;

    switch (sortField) {
      case "name":
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;

      case "specialist":
        valueA = a.specialist.toLowerCase();
        valueB = b.specialist.toLowerCase();
        break;

      case "priority":
        valueA = a.priority;
        valueB = b.priority;
        break;

      case "status":
        valueA = a.status === "Online" ? 1 : 0;
        valueB = b.status === "Online" ? 1 : 0;
        break;
    }

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Number of shimmer rows while loading
  const shimmerRows = Array.from({ length: 5 });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return "▼";
    return sortDirection === "asc" ? "▲" : "▼";
  };

  return (
    <div className="w-full rounded overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                    No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                    Image
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Doctor Name
                      <span className="text-gray-500 text-xs">
                        {getSortIcon("name")}
                      </span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("specialist")}
                  >
                    <div className="flex items-center gap-2">
                      Specialist
                      <span className="text-gray-500 text-xs">
                        {getSortIcon("specialist")}
                      </span>
                    </div>
                  </th>

                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("priority")}
                  >
                    <div className="flex items-center gap-2">
                      Priority
                      <span className="text-gray-500 text-xs">
                        {getSortIcon("priority")}
                      </span>
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <span className="text-gray-500 text-xs">
                        {getSortIcon("status")}
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  shimmerRows.map((_, i) => (
                    <tr key={i} className="animate-pulse hover:bg-gray-50">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td
                          key={j}
                          className="px-6 py-4 border-b border-gray-100"
                        >
                          <Skeleton className="h-4 w-full rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : sortedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-16 text-center border-b border-gray-200"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-gray-400 mb-3">
                          <svg
                            className="w-16 h-16"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-lg font-medium text-gray-700">
                          No doctors found
                        </span>
                        <span className="text-sm text-gray-500 mt-1">
                          Try adjusting your search or add a new doctor
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedData.map((doctor, index) => (
                    <DoctorRow
                      key={doctor.id}
                      doctor={doctor}
                      index={index}
                      onEdit={() => onEdit(doctor)}
                      onDelete={() => onDelete(doctor)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

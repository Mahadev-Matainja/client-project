import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AmbulanceRow from "./AmbulanceRows";
import { AmbulanceList } from "@/@types/ambulance";

interface AmbulanceTableProps {
  data: AmbulanceList[];
  loading: boolean;
  onEdit: (item: AmbulanceList) => void;
  onDelete: (item: AmbulanceList) => void;
}

type SortField = "name" | "availability" | "verified" | "status" | null;
type SortDirection = "asc" | "desc";

export default function AmbulanceTable({
  data,
  loading,
  onEdit,
  onDelete,
}: AmbulanceTableProps) {
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

    let valueA, valueB;

    switch (sortField) {
      case "name":
        valueA = a.name;
        valueB = b.name;
        break;
      case "availability":
        valueA = a.availability ? 1 : 0;
        valueB = b.availability ? 1 : 0;
        break;
      case "verified":
        valueA = a.verified ? 1 : 0;
        valueB = b.verified ? 1 : 0;
        break;
      case "status":
        valueA = a.status ? 1 : 0;
        valueB = b.status ? 1 : 0;
        break;
      default:
        return 0;
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
    <div className="w-full rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
                      No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
                      Image
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Name
                        <span className="text-black">
                          {getSortIcon("name")}
                        </span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
                      Vehicle
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => handleSort("availability")}
                    >
                      <div className="flex items-center gap-1">
                        Availability
                        <span className="text-black">
                          {getSortIcon("availability")}
                        </span>
                      </div>
                    </th>

                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => handleSort("verified")}
                    >
                      <div className="flex items-center gap-1">
                        Verified
                        <span className="text-black">
                          {getSortIcon("verified")}
                        </span>
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                      onClick={() => handleSort("verified")}
                    >
                      <div className="flex items-center gap-1">
                        Status
                        <span className="text-black">
                          {getSortIcon("verified")}
                        </span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-300 cursor-pointer">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    // Shimmer loader rows
                    shimmerRows.map((_, i) => (
                      <tr key={i} className="animate-pulse hover:bg-gray-50">
                        {Array.from({ length: 10 }).map((_, j) => (
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
                        colSpan={10}
                        className="px-6 py-12 text-center border-b border-gray-200"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-gray-400 mb-2">
                            <svg
                              className="w-12 h-12"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <span className="text-lg font-medium text-gray-700">
                            No data found
                          </span>
                          <span className="text-sm text-gray-500 mt-1">
                            Try adjusting your search or add new data
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedData.map((item, i) => (
                      <AmbulanceRow
                        key={item.id}
                        item={item}
                        index={i}
                        onEdit={() => onEdit(item)}
                        onDelete={() => onDelete(item)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

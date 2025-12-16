"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  rows?: number; // number of placeholder rows
  columns?: number; // number of placeholder columns
};

const TableSkeleton: React.FC<Props> = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="overflow-hidden rounded-md border border-gray-200">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {[...Array(columns)].map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Skeleton className="h-4 w-24 bg-gray-300" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {[...Array(columns)].map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton className="h-5 w-full bg-gray-300 rounded-md" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;

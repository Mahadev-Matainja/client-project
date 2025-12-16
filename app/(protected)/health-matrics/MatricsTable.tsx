"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchMatricsTableData } from "@/services/DashboardService";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { CommonDataTable } from "@/components/CommonDataTable";
import { ColumnDef } from "@tanstack/react-table";

interface MetricHistory {
  [key: string]: string | number | null;
  date: string;
  status: string;
}

interface MetricCurrent {
  [key: string]: string | number | null;
  date: string;
  status: string;
}

interface Metric {
  title: string;
  current: MetricCurrent;
  history: MetricHistory[];
  unit?: string;
  icon?: string;
  fields: string[];
}

export default function HealthTables() {
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState<Metric[]>([]);
  const vitalStats = useSelector(
    (state: RootState) => state.vitalStats.vitalStats
  );

  // ✅ Generate columns dynamically based on metric.fields
  const generateColumns = (fields: string[]): ColumnDef<any>[] => {
    return fields.map((field) => ({
      accessorKey: field,
      header: field.charAt(0).toUpperCase() + field.slice(1),
      cell: ({ getValue }) => {
        const rawValue = getValue(); // raw unknown type
        const value = rawValue as string | number | null; // ✅ type assertion

        if (field === "date" && typeof value === "string") {
          const date = new Date(value);
          return isNaN(date.getTime()) ? "—" : date.toLocaleString();
        }

        if (field === "status" && typeof value === "string") {
          const color =
            value === "critical"
              ? "text-red-600"
              : value === "high"
              ? "text-orange-500"
              : value === "normal"
              ? "text-green-600"
              : "text-gray-500";
          return <span className={`font-semibold ${color}`}>{value}</span>;
        }

        return value ?? "—";
      },
    }));
  };

  useEffect(() => {
    if (vitalStats && vitalStats.length > 0) {
      const fetchAllCard = async () => {
        try {
          const res: Metric[] = await fetchMatricsTableData();
          if (res) setHealthData(res);
        } catch (err) {
          console.error("Error fetching metrics:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchAllCard();
    }
  }, [vitalStats]);

  if (loading) return <p className="text-center p-6">Loading metrics...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
      {healthData.map((metric, index) => {
        const columns = generateColumns(metric.fields); // ✅ generate here

        return (
          <Card key={index} className="shadow-md border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {metric.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {/* ✅ Current Reading */}
              {metric.current ? (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Current:</p>
                  <div className="gap-4 flex-wrap">
                    {metric.fields
                      .filter((f) => f !== "date" && f !== "status")
                      .map((field) => (
                        <p key={field} className="text-md">
                          <span className="font-bold mr-1.5">
                            {field.charAt(0).toUpperCase() + field.slice(1)}:
                          </span>
                          <span className="text-gray-700">
                            {metric.current[field]} {metric.unit || ""}
                          </span>
                        </p>
                      ))}
                  </div>
                  <p
                    className={`text-xs font-semibold ${
                      metric.current.status === "high" ||
                      metric.current.status === "critical"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    Status: {metric.current.status}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 mb-4">No current data</p>
              )}

              {/* ✅ Reusable Data Table */}
              <CommonDataTable
                columns={columns} // ✅ use generated columns here
                data={metric.history}
                enablePagination
                initialPageSize={10}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

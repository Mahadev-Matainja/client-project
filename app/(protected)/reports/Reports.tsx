"use client";

import MainLayout from "@/components/layout/main-layout";
import React, { useMemo, useState } from "react";
import FilterWidgets from "./components/widget/FilterWidget";
import { toast } from "@/hooks/use-toast";
import api from "@/utils/api";
import { Button } from "@/components/ui/button";
import { CommonDataTable } from "@/components/CommonDataTable";
import { ColumnDef } from "@tanstack/react-table";
import TableSkeleton from "@/components/feature/TableSkeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

type Props = {};

export type ReportsFilterType = {
  test: string;
  group: string;
  parameter: string;
  dateRange:
    | "date_range"
    | "today"
    | "last_month"
    | "last_year"
    | "last_2_year"
    | "custom"
    | string;
  startDate: Date | null;
  endDate: Date | null;
};

const today = new Date();
const oneMonthAgo = new Date();
const sixMonthAgo = new Date();
const oneYearAgo = new Date();
const twoYearAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);
sixMonthAgo.setMonth(today.getMonth() - 6);
oneYearAgo.setFullYear(today.getFullYear() - 1);
twoYearAgo.setFullYear(today.getFullYear() - 2);

// Helper: format as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const initialvalue: ReportsFilterType = {
  test: "Select Test",
  group: "Select Group",
  parameter: "Select Parameter",
  dateRange: "date_range",
  startDate: sixMonthAgo,
  endDate: today,
};

type FilterPayload = {
  test_id: number;
  group_id: number | null;
  parameter_id: number | null;
  start_date: string;
  end_date: string;
};

// one measurement row
interface ReportItem {
  key: string; // e.g. "hemoglobin", "mcv", ...
  unit: string; // e.g. "g/dL", "fL", "%", ...
  value: string; // comes as string in your payload
  range: string; // normal range value
  lab_name: string; // lab name
  group_name: string; // group name
  dr_name: string; // doctor name
}

// each object has a single date key → array of items
type ReportByDate = Record<string, ReportItem[]>;

export type ReportsFilterResponse = {
  payload: {
    test_id: number;
    group_id: number;
    from: string;
    to: string;
  };
  reports: ReportByDate[];
};

type FlatRow = { date: string } & ReportItem;

const Reports = (_props: Props) => {
  const [filter, setFilter] = useState<ReportsFilterType>(initialvalue);
  const [filterValue, setFilterValue] = useState<ReportsFilterResponse | null>(
    null
  );
  const [responseLoading, setResponseLoading] = useState<boolean>(false);
  const [downloadResponseLoading, setDownloadResponseLoading] =
    useState<boolean>(false);
  const [initial, setInitial] = useState<boolean>(true);

  const { user } = useSelector((state: RootState) => state.auth);

  // Format a safe payload for the current filter selection
  const buildPayload = (value: ReportsFilterType): FilterPayload | null => {
    // must select test & group
    // if (value.test === "Select Test" || value.group === "Select Group") {
    //   if (value.test === "Select Test" && value.group === "Select Group") {
    //     toast({ title: "Please Select Test and Group" });
    //   } else if (value.test === "Select Test") {
    //     toast({ title: "Please Select Test" });
    //   } else {
    //     toast({ title: "Please Select Group" });
    //   }
    //   return null;
    // }

    // must select test
    if (value.test === "Select Test") {
      toast({ title: "Please Select Test" });
      return null;
    }

    let payload: FilterPayload = {
      test_id: Number(value.test),
      group_id: value.group === "Select Group" ? null : Number(value.group),
      parameter_id:
        value.parameter === "Select Parameter" ? null : Number(value.parameter),
      start_date: "",
      end_date: "",
    };

    // date handling
    if (value.dateRange === "date_range") {
      // must provide custom dates in this mode
      if (!value.startDate || !value.endDate) {
        toast({ title: "Please Select Date" });
        return null;
      }
      payload.start_date = formatDate(value.startDate);
      payload.end_date = formatDate(value.endDate);
    } else if (value.dateRange === "today") {
      payload.start_date = formatDate(today);
      payload.end_date = formatDate(today);
    } else if (value.dateRange === "last_month") {
      payload.start_date = formatDate(oneMonthAgo);
      payload.end_date = formatDate(today);
    } else if (value.dateRange === "last_6_month") {
      payload.start_date = formatDate(sixMonthAgo);
      payload.end_date = formatDate(today);
    } else if (value.dateRange === "last_year") {
      payload.start_date = formatDate(oneYearAgo);
      payload.end_date = formatDate(today);
    } else if (value.dateRange === "last_2_year") {
      payload.start_date = formatDate(twoYearAgo);
      payload.end_date = formatDate(today);
    } else if (value.dateRange === "custom") {
      if (!value.startDate || !value.endDate) {
        toast({ title: "Please Select Date" });
        return null;
      }
      payload.start_date = formatDate(value.startDate);
      payload.end_date = formatDate(value.endDate);
    } else {
      // fallback: treat any other string as custom if dates exist
      if (!value.startDate || !value.endDate) {
        toast({ title: "Please Select Date" });
        return null;
      }
      payload.start_date = formatDate(value.startDate);
      payload.end_date = formatDate(value.endDate);
    }

    return payload;
  };

  const handleFilter = async (value: ReportsFilterType) => {
    setFilter(value);
    setInitial(false);

    const payload = buildPayload(value);
    if (!payload) return;

    try {
      setResponseLoading(true);
      const { data } = await api.post<ReportsFilterResponse>(
        `/tests/reports`,
        payload
      );
      setFilterValue(data);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to load reports",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong.",
      });
    } finally {
      setResponseLoading(false);
    }
  };

  const handlePdfDownload = async () => {
    try {
      setDownloadResponseLoading(true);
      const getUrl = () => {
        if (filterValue === null) return "";

        if (filterValue?.payload.group_id === null) {
          return `report/pdf?test_id=${
            filterValue?.payload.test_id
          }&start_date=${formatDate(
            new Date(filterValue?.payload.from)
          )}&end_date=${formatDate(new Date(filterValue?.payload.to))}`;
        }

        return `report/pdf?test_id=${filterValue?.payload.test_id}&group_id=${
          filterValue?.payload.group_id
        }&start_date=${formatDate(
          new Date(filterValue?.payload.from)
        )}&end_date=${formatDate(new Date(filterValue?.payload.to))}`;
      };

      // ✅ Request file as blob
      const response = await api.get(getUrl(), {
        responseType: "blob",
        headers: { Accept: "application/pdf" },
        // withCredentials: true, // ← uncomment if your API requires cookies
      });

      // ✅ Create download link
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${user?.first_name}_${
        user?.last_name
      }_${new Date().toDateString()}.pdf`; // <-- set any file name
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url); // cleanup
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to load reports",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong.",
      });
    } finally {
      setDownloadResponseLoading(false);
    }
  };

  // Build a single flat rows array: [{date, key, value, unit, range, lab_name, group_name, dr_name}]
  const flatRows = useMemo(() => {
    if (!filterValue?.reports?.length)
      return [] as Array<{ date: string } & ReportItem>;

    const tmp: Array<{ date: string } & ReportItem> = [];
    for (const obj of filterValue.reports) {
      const dateKey = Object.keys(obj)[0];
      if (!dateKey) continue;
      const rows = obj[dateKey] ?? [];
      for (const r of rows) {
        tmp.push({ date: dateKey, ...r });
      }
    }

    // sort by date asc, then by parameter name
    tmp.sort((a, b) => {
      const d = a.date.localeCompare(b.date);
      if (d !== 0) return d;
      return a.key.localeCompare(b.key);
    });

    return tmp;
  }, [filterValue]);

  const columns: ColumnDef<FlatRow>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ getValue }) => (
        <span className="whitespace-nowrap">{getValue<string>()}</span>
      ),
      sortingFn: "alphanumeric",
      meta: {
        stickyLeft: true,
        pxWidth: 200, // adjust width you want for the sticky Date col
        headerClassName: "text-left font-semibold",
        cellClassName: "text-left font-medium",
      },
    },
    {
      accessorKey: "key",
      header: "Parameter",
      cell: ({ getValue }) => <span>{getValue<string>()}</span>,
    },
    {
      accessorKey: "value",
      header: () => <div className="text-right">Value</div>,
      cell: ({ getValue }) => (
        <div className="text-right tabular-nums">{getValue<string>()}</div>
      ),
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "unit",
      header: "Unit",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue<string>()}</span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "range",
      header: "Range",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground text-sm">
          {getValue<string>()}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "lab_name",
      header: "Lab name",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground text-sm">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "group_name",
      header: "Group name",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground text-sm">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "dr_name",
      header: "Doctor name",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground text-sm">
          {getValue<string>()}
        </span>
      ),
    },
  ];

  return (
    <MainLayout>
      <header className="mb-4 text-xl font-semibold">Reports</header>

      <FilterWidgets filter={filter} setFilter={handleFilter} />

      {/* Loading */}
      {responseLoading && (
        <div className="mt-6">
          <TableSkeleton rows={10} />
        </div>
      )}

      {!responseLoading && (
        <>
          {/* export buttons */}
          <div className="flex items-center justify-end mt-4">
            <Button
              variant="outline"
              className="flex items-center justify-center p-2 rounded-md cursor-pointer"
              onClick={handlePdfDownload}
              disabled={downloadResponseLoading}
            >
              {downloadResponseLoading ? (
                <svg
                  className="animate-spin h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : (
                <img src="/icon/pdf.png" className="w-6 h-6" />
              )}
            </Button>
          </div>

          {/* Results */}
          <div className="overflow-x-auto mt-4">
            <CommonDataTable
              columns={columns}
              data={flatRows}
              enableSearch
              enablePagination
              enableRowSelection={true} // 👈 turns on checkbox column
              selectionStickyLeft // (optional) keep it sticky on the left
              initialPageSize={25}
              pageSizeOptions={[10, 25, 50, 100]}
              mergeByKey="date" // <- merges identical dates per page
              mergeCellClassName="font-semibold whitespace-nowrap"
            />
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Reports;

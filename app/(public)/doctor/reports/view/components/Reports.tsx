"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import FilterWidgets from "./widget/FilterWidget";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import { CommonDataTable } from "@/components/CommonDataTable";
import TableSkeleton from "@/components/feature/TableSkeleton";

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
  pin?: string;
  unique_key?: string;
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
  customer_data: {
    id: number;
    avatar: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile_no: string;
    dob: string;
    gender: string;
    details: {
      id: number;
      customer_id: number;
      address: number | string | null;
      blood_group: number | string | null;
      height: number | string | null;
      weight: number | string | null;
      primary_doctor: number | string | null;
      has_chronic_diseases: string;
      chronic_diseases: string;
      current_medications: number | string | null;
      emergency_contact: string;
      emergency_phone: string;
      health_goals: number | string | null;
      allergies: number | string | null;
      communication_preferences: number | string | null;
      privacy_accepted: number;
      terms_accepted: number;
      created_at: string;
      updated_at: string;
    };
    age: {
      years: number;
      months: number;
      days: number;
      label: string;
    };
    doctor_pin: {
      id: number;
      customer_id: number;
      pin: string;
      attempts: number;
      max_attempts: number;
      unique_key: string;
      expires_at: number | string | null;
      is_revoked: string;
      created_at: string;
      updated_at: string;
    };
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
  const [logoutResponse, setLogoutResponse] = useState<boolean>(false);
  const [initial, setInitial] = useState<boolean>(true);

  const pin = localStorage.getItem("doctor_pin");
  const uniqueKey = localStorage.getItem("doctor_unique_key");

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace("/api", "") || "";

  useEffect(() => {
    if (!pin || !uniqueKey) {
      history.back();
    }
  }, [pin, uniqueKey]);

  // logout
  const handleLogout = async () => {
    setLogoutResponse(true);

    const payload = {
      customer_id: filterValue?.customer_data.id,
      unique_key: uniqueKey,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/guest/doctor/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + localStorage.getItem("doctor_bearer") || "",
          },
          body: payload ? JSON.stringify(payload) : undefined,
          cache: "no-store",
        }
      );

      const data = await res.json();

      toast({
        title: data.message || data.response.data.message,
      });

      localStorage.removeItem("doctor_bearer");
      localStorage.removeItem("doctor_pin");
      localStorage.removeItem("doctor_unique_key");

      window.location.href = data.redirect_url;
    } catch (error: any) {
      toast({
        title: error?.message || error.response.data.message,
      });
    } finally {
      setLogoutResponse(false);
    }
  };

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

    let payload = buildPayload(value);
    if (!payload) return;

    payload = {
      ...payload,
      pin: String(pin),
      unique_key: String(uniqueKey),
    };

    try {
      setResponseLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/guest/doctor/reports/view`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + localStorage.getItem("doctor_bearer") || "",
          },
          body: payload ? JSON.stringify(payload) : undefined,
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (
        !data.success &&
        data.message === "invalid expired or wrong link..!"
      ) {
        window.location.href = `/dv/${payload.unique_key}`;
        localStorage.removeItem("doctor_bearer");
        localStorage.removeItem("doctor_pin");
        localStorage.removeItem("doctor_unique_key");
        toast({
          title: "Please re-enter pin",
        });
      }

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

  // Build a single flat rows array: [{date, key, value, unit, range, lab_name, group_name}]
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
    <>
      <div className="min-h-screen p-4 bg-[#F3F4F6]">
        {/* logout button */}
        <div className="flex justify-end">
          <Button
            className="cursor-pointer bg-red-500 text-white"
            onClick={handleLogout}
            disabled={logoutResponse || responseLoading}
          >
            {logoutResponse ? "Log out..." : "Log out"}
          </Button>
        </div>

        {/* customer details */}
        {!responseLoading && filterValue && (
          <div>
            <div>
              <div className="py-2 px-4 border-b-2 border-gray-400">
                <div className="flex gap-2">
                  {/* profile image */}
                  <Avatar className="h-32 w-32">
                    <AvatarImage
                      src={
                        filterValue?.customer_data?.avatar
                          ? `${BASE_URL}/${filterValue.customer_data.avatar}`
                          : "/noProfileImage.png"
                      }
                      alt="User Avatar"
                    />
                  </Avatar>
                  <div>
                    {/* <div>
                      {filterValue.customer_data.id && (
                        <>#{filterValue.customer_data.id}</>
                      )}
                    </div> */}
                    <strong className="text-2xl">
                      {filterValue?.customer_data?.first_name &&
                        filterValue?.customer_data?.last_name && (
                          <>
                            {filterValue?.customer_data?.first_name}{" "}
                            {filterValue?.customer_data?.last_name}
                          </>
                        )}
                    </strong>
                    <div>
                      {filterValue?.customer_data?.email && (
                        <>{filterValue?.customer_data?.email}</>
                      )}
                    </div>

                    <div>
                      {filterValue?.customer_data?.mobile_no && (
                        <>
                          <span>+91</span>-
                          {filterValue?.customer_data?.mobile_no}
                        </>
                      )}
                    </div>

                    <div>
                      {filterValue?.customer_data?.details.address && (
                        <>{filterValue?.customer_data?.details.address}</>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-2 px-4 border-b-2 border-gray-400 grid md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {filterValue?.customer_data?.gender && (
                  <div>
                    <strong>Gender :</strong>
                    {filterValue?.customer_data?.gender
                      ?.charAt(0)
                      .toUpperCase() +
                      filterValue?.customer_data?.gender?.slice(1)}
                  </div>
                )}
                {filterValue?.customer_data?.age?.label && (
                  <div>
                    <strong>Age :</strong>
                    {filterValue?.customer_data?.age?.label}
                  </div>
                )}
                {filterValue?.customer_data?.details?.weight && (
                  <div>
                    <strong>Weight :</strong>
                    {filterValue?.customer_data?.details?.weight}
                  </div>
                )}
                {filterValue?.customer_data?.details?.height && (
                  <div>
                    <strong>Height :</strong>
                    {filterValue?.customer_data?.details?.height}
                  </div>
                )}
                {filterValue?.customer_data?.details?.blood_group && (
                  <div>
                    <strong>Blood Group :</strong>
                    {filterValue?.customer_data?.details?.blood_group}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div>
          <header className="mt-4 mb-4 text-xl font-semibold">Reports</header>
        </div>

        <FilterWidgets filter={filter} setFilter={handleFilter} />

        {/* Loading */}
        {responseLoading && (
          <div className="mt-6">
            <TableSkeleton />
          </div>
        )}

        {/* Results */}
        {!responseLoading && (
          <>
            {/* export buttons */}
            <div className="flex items-center justify-end mt-4">
              <Button
                variant="outline"
                className="text-left font-normal cursor-pointer text-white p-0"
              >
                <img src={`/icon/pdf.png`} className="w-8" />
              </Button>
            </div>
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
      </div>
    </>
  );
};

export default Reports;

"use client";

import MainLayout from "@/components/layout/main-layout";
import React, { useEffect, useState } from "react";
import FilterWidgets from "./components/widget/FilterWidgets";
import TestCompareTable from "./components/widget/TestCompareTable";
import api from "@/utils/api";
import { toast } from "@/hooks/use-toast";
import TableSkeleton from "@/components/feature/TableSkeleton";

type Props = {};

export type TestCompareFilterType = {
  test: string;
  group: string;
  parameter: string;
  dateRange:
    | "date_range"
    | "today"
    | "last_month"
    | "last_year"
    | "custom"
    | string;
  startDate: Date | null;
  endDate: Date | null;
};

const today = new Date();
const oneMonthAgo = new Date();
const oneYearAgo = new Date();
const twoYearAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);
oneYearAgo.setFullYear(today.getFullYear() - 1);
twoYearAgo.setFullYear(today.getFullYear() - 2);

// Helper: format as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const initialvalue: TestCompareFilterType = {
  test: "Select Test",
  group: "Select Group",
  parameter: "Select Parameter",
  dateRange: "last_year",
  startDate: oneYearAgo,
  endDate: today,
};

type FilterPayload = {
  test_id: number;
  group_id: number;
  parameter_id: number | null;
  start_date: string;
  end_date: string;
};

type responseParameter = {
  key: string;
  value: string;
};

// one measurement row
interface ReportItem {
  key: string; // e.g. "hemoglobin", "mcv", ...
  unit: string; // e.g. "g/dL", "fL", "%", ...
  value: string; // comes as string in your payload
}

// each object has a single date key → array of items
type ReportByDate = Record<string, ReportItem[]>;

export type TestComparisonFilterResponse = {
  payload: {
    test_id: number;
    group_id: number;
    parameter_id: number | null;
    from: string;
    to: string;
  };
  parameters: responseParameter[];
  reports: ReportByDate[];
};

const TestCompare = (props: Props) => {
  const [filter, setFilter] = useState<TestCompareFilterType>(initialvalue);
  const [filterValue, setFilterValue] =
    useState<TestComparisonFilterResponse | null>(null);
  const [responseLoading, setResponseLoading] = useState<boolean>(false);

  const handleFilter = (value: TestCompareFilterType) => {
    setFilter(value);

    const fetchData = async (payload: FilterPayload) => {
      setResponseLoading(true);

      // call api according filter
      const { data } = await api.post<TestComparisonFilterResponse>(
        `/tests/comparison`,
        payload
      );

      setFilterValue(data);

      setResponseLoading(false);
    };

    let payload: FilterPayload = {
      test_id: 0,
      group_id: 0,
      parameter_id: null,
      start_date: "",
      end_date: "",
    };

    if (value.test !== "Select Test" && value.group !== "Select Group") {
      payload = {
        ...payload,
        test_id: Number(value.test),
        group_id: Number(value.group),
      };

      if (value.parameter === "Select Parameter") {
        payload = { ...payload, parameter_id: null };
      } else {
        payload = { ...payload, parameter_id: Number(value.parameter) };
      }

      if (value.dateRange !== "date_range") {
        if (value.dateRange === "today") {
          payload = {
            ...payload,
            start_date: formatDate(today),
            end_date: formatDate(today),
          };
        } else if (value.dateRange === "last_month") {
          payload = {
            ...payload,
            start_date: formatDate(oneMonthAgo),
            end_date: formatDate(today),
          };
        } else if (value.dateRange === "last_year") {
          payload = {
            ...payload,
            start_date: formatDate(oneYearAgo),
            end_date: formatDate(today),
          };
        } else if (value.dateRange === "last_2_year") {
          payload = {
            ...payload,
            start_date: formatDate(twoYearAgo),
            end_date: formatDate(today),
          };
        } else {
          payload = {
            ...payload,
            start_date: value.startDate ? formatDate(value.startDate) : "",
            end_date: value.endDate ? formatDate(value.endDate) : "",
          };
        }
      } else {
        console.log("Please select a date");
        if (value.dateRange === "date_range") {
          toast({
            title: "Please Select Date",
          });
          return;
        }
      }

      fetchData(payload);
    } else {
      if (value.test === "Select Test" && value.group === "Select Group") {
        toast({
          title: "Please Select Test and Group",
        });
        return;
      }

      if (value.test === "Select Test") {
        toast({
          title: "Please Select Test",
        });
        return;
      }

      if (value.group === "Select Group") {
        toast({
          title: "Please Select Group",
        });
        return;
      }
    }
  };

  return (
    <MainLayout>
      <header className="mb-4">Report Compare</header>
      <FilterWidgets
        filter={filter}
        setFilter={handleFilter}
        response={responseLoading}
      />

      {/* compare table */}
      {responseLoading ? (
        <div className="mt-6">
          <TableSkeleton rows={10} />
        </div>
      ) : (
        <TestCompareTable data={filterValue} />
      )}
    </MainLayout>
  );
};

export default TestCompare;

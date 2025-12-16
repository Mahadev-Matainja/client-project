"use client";

import { CommonDataTable } from "@/components/CommonDataTable";
import { TestComparisonFilterResponse } from "../../TestCompare";
import { ColumnDef } from "@tanstack/react-table";

type Props = {
  data: TestComparisonFilterResponse | null;
};

// Row = one date; dynamic parameter keys become columns
export type TestCompareRow = {
  id: string; // same as date label
  date: string; // visible "Date" column
  [paramKey: string]: string; // dynamic cells
};

// --- helpers ---
const parseDateLabel = (label: string): number => {
  const t = Date.parse(label);
  return Number.isFinite(t) ? t : 0;
};

const titleCase = (s: string): string =>
  s
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase());

/**
 * Builds the Payment-like columns (accessorKey + header as strings)
 * and the rows array ready for TanStack.
 */
function buildTestCompareTable(resp: TestComparisonFilterResponse): {
  columns: ColumnDef<TestCompareRow>[];
  data: TestCompareRow[];
} {
  // --- collect date labels (sorted) ---
  const dateLabels = Array.from(
    new Map(
      (resp.reports ?? []).map((o) => {
        const [label] = Object.keys(o);
        return [label, parseDateLabel(label ?? "")];
      })
    ).entries()
  )
    .filter(([label]) => !!label)
    .sort((a, b) => a[1] - b[1])
    .map(([label]) => label as string);

  // --- measurements by (date -> key) ---
  const byDateAndKey: Record<string, Record<string, string>> = {};
  for (const obj of resp.reports ?? []) {
    const [dateLabel] = Object.keys(obj);
    if (!dateLabel) continue;
    byDateAndKey[dateLabel] ??= {};
    (obj[dateLabel] ?? []).forEach((it) => {
      byDateAndKey[dateLabel][it.key] = it.unit
        ? `${it.value} ${it.unit}`
        : it.value;
    });
  }

  // --- optional parameters (parametersByDate) ---
  const parametersByDate = (resp as any)?.parametersByDate as
    | Record<string, Record<string, string>>
    | undefined;

  // gather all header keys = optional first, then measured
  const optionalKeys = new Set<string>();
  if (parametersByDate) {
    Object.values(parametersByDate).forEach((row) => {
      Object.keys(row ?? {}).forEach((k) => optionalKeys.add(k));
    });
  }

  const measuredKeys = new Set<string>();
  Object.values(byDateAndKey).forEach((m) =>
    Object.keys(m).forEach((k) => measuredKeys.add(k))
  );

  const headerParamKeys = [
    ...Array.from(optionalKeys).sort((a, b) => a.localeCompare(b)),
    ...Array.from(measuredKeys).sort((a, b) => a.localeCompare(b)),
  ];

  // --- build rows (Payment-style data array) ---
  const data: TestCompareRow[] = dateLabels.map((date) => {
    const row: TestCompareRow = { id: date, date };
    headerParamKeys.forEach((k) => {
      row[k] = parametersByDate?.[date]?.[k] ?? byDateAndKey[date]?.[k] ?? "—";
    });
    return row;
  });

  // --- build columns (Payment-style ColumnDef[]) ---
  const columns: ColumnDef<TestCompareRow>[] = [
    {
      accessorKey: "date",
      header: "Date",
      meta: {
        stickyLeft: true,
        pxWidth: resp.payload.parameter_id === null ? 200 : 20, // adjust width you want for the sticky Date col
        headerClassName: "text-left font-semibold",
        cellClassName: "text-left font-medium",
      },
    },
    ...headerParamKeys.map((k) => ({
      accessorKey: k,
      header: titleCase(k),
    })),
  ];

  return { columns, data };
}

const TestCompareTable: React.FC<Props> = ({ data }) => {
  if (data === null) {
    return (
      <div className="overflow-x-auto mt-4">
        <CommonDataTable
          columns={[]}
          data={[]}
          enableSearch
          enablePagination
          enableRowSelection={true} // 👈 turns on checkbox column
          selectionStickyLeft // (optional) keep it sticky on the left
          initialPageSize={25}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </div>
    );
  }

  const tableData = buildTestCompareTable(data);

  return (
    <div className="overflow-x-auto mt-4">
      <CommonDataTable
        columns={tableData.columns}
        data={tableData.data}
        enableSearch
        enablePagination
        enableRowSelection={true} // 👈 turns on checkbox column
        selectionStickyLeft // (optional) keep it sticky on the left
        initialPageSize={25}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    </div>
  );
};

export default TestCompareTable;

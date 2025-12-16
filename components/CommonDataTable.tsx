"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type ColMeta = {
  stickyLeft?: boolean;
  pxWidth?: number;
  headerClassName?: string;
  cellClassName?: string;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  enableSearch?: boolean;
  searchPlaceholder?: string;

  enablePagination?: boolean;
  pageSizeOptions?: number[];
  initialPageSize?: number;

  enableRowSelection?: boolean;
  selectionStickyLeft?: boolean;
  onRowSelectionChange?: (state: RowSelectionState) => void;

  mergeByKey?: string;
  mergeCellClassName?: string;

  /** optional row coloring function */
  getRowClassName?: (row: TData, rowIndex: number) => string;
}

export function CommonDataTable<TData, TValue>({
  columns,
  data,
  enableSearch = false,
  searchPlaceholder = "Search...",
  enablePagination = false,
  pageSizeOptions = [10, 20, 50, 100],
  initialPageSize = 10,
  enableRowSelection = false,
  selectionStickyLeft = true,
  onRowSelectionChange,
  mergeByKey,
  mergeCellClassName,
  getRowClassName, // <-- optional row coloring
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const columnsWithSelection = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    if (!enableRowSelection) return columns;

    const selectCol: ColumnDef<TData, TValue> = {
      id: "__select",
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      meta: {
        stickyLeft: selectionStickyLeft,
        pxWidth: 48,
        headerClassName: "w-12 min-w-[48px] max-w-[48px]",
        cellClassName: "w-12 min-w-[48px] max-w-[48px]",
      } as ColMeta,
    };

    return [selectCol, ...columns];
  }, [columns, enableRowSelection, selectionStickyLeft]);

  const table = useReactTable({
    data,
    columns: columnsWithSelection,
    state: { globalFilter, rowSelection },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(next);
      onRowSelectionChange?.(next);
    },
    getCoreRowModel: getCoreRowModel(),
    ...(enableSearch ? { getFilteredRowModel: getFilteredRowModel() } : {}),
    ...(enablePagination
      ? { getPaginationRowModel: getPaginationRowModel() }
      : {}),
    globalFilterFn: (row, _colId, filterValue) => {
      const val = Object.values(row.original as any)
        .join(" ")
        .toLowerCase();
      return val.includes(String(filterValue).toLowerCase());
    },
    enableRowSelection,
  });

  React.useEffect(() => {
    if (enablePagination) table.setPageSize(initialPageSize);
  }, [enablePagination, initialPageSize, table]);

  const stickyOffsets = React.useMemo(() => {
    const leaf = table.getAllLeafColumns();
    let left = 0;
    const map: Record<string, number> = {};
    for (const c of leaf) {
      const meta = (c.columnDef.meta as ColMeta) || {};
      if (meta.stickyLeft) {
        map[c.id] = left;
        left += meta.pxWidth ?? 180;
      }
    }
    return map;
  }, [table]);

  const pageRows = table.getRowModel().rows;

  const rowSpanRuns: Record<number, number> | null = React.useMemo(() => {
    if (!mergeByKey) return null;
    if (!pageRows.length) return {};
    const runs: Record<number, number> = {};
    let i = 0;
    while (i < pageRows.length) {
      const currentVal = pageRows[i]?.getValue(mergeByKey as any);
      let j = i + 1;
      while (
        j < pageRows.length &&
        pageRows[j]?.getValue(mergeByKey as any) === currentVal
      ) {
        j++;
      }
      runs[i] = j - i;
      i = j;
    }
    return runs;
  }, [mergeByKey, pageRows]);

  return (
    <div className="w-full">
      {(enableSearch || enablePagination) && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {enableSearch && (
            <Input
              className="max-w-sm bg-white focus:outline-none focus:ring-0"
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          )}
          {enablePagination && (
            <div className="ml-auto flex items-center gap-2">
              <Select
                value={String(table.getState().pagination.pageSize)}
                onValueChange={(v) => table.setPageSize(Number(v))}
              >
                <SelectTrigger className="w-[120px] bg-white cursor-pointer">
                  <SelectValue placeholder="Rows/page" />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((opt) => (
                    <SelectItem key={opt} value={String(opt)}>
                      {opt} / page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="cursor-pointer"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="overflow-auto rounded-md border">
        <Table className="cursor-default">
          <TableHeader className="sticky top-0 z-30 bg-white/90 backdrop-blur">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => {
                  const meta = (h.column.columnDef.meta as ColMeta) || {};
                  const isSticky = !!meta.stickyLeft;
                  const left = stickyOffsets[h.column.id] ?? 0;
                  return (
                    <TableHead
                      key={h.id}
                      className={clsx(
                        meta.headerClassName,
                        isSticky && "sticky z-20 bg-white"
                      )}
                      style={
                        isSticky
                          ? {
                              left,
                              minWidth: meta.pxWidth ?? 180,
                              maxWidth: meta.pxWidth ?? 180,
                            }
                          : undefined
                      }
                    >
                      {h.isPlaceholder
                        ? null
                        : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {pageRows.length ? (
              pageRows.map((row, rowIndex) => {
                const selected = row.getIsSelected();
                return (
                  <TableRow
                    key={row.id}
                    data-state={selected && "selected"}
                    className={clsx(
                      selected
                        ? "bg-white text-black dark:bg-white dark:text-black"
                        : getRowClassName
                        ? getRowClassName(row.original, rowIndex)
                        : undefined,
                      "transition"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const colId = cell.column.id;
                      const meta =
                        (cell.column.columnDef.meta as ColMeta) || {};
                      const isSticky = !!meta.stickyLeft;
                      const left = stickyOffsets[colId] ?? 0;

                      if (mergeByKey && colId === mergeByKey) {
                        const isFirstOfRun =
                          rowSpanRuns?.[rowIndex] !== undefined;
                        if (!isFirstOfRun) return null;
                        const span = rowSpanRuns?.[rowIndex] ?? 1;
                        return (
                          <TableCell
                            key={cell.id}
                            rowSpan={span}
                            className={clsx(
                              meta.cellClassName,
                              isSticky && "sticky z-10 bg-white",
                              enableRowSelection &&
                                selected &&
                                "text-black dark:text-black bg-white",
                              mergeCellClassName
                            )}
                            style={
                              isSticky
                                ? {
                                    left,
                                    minWidth: meta.pxWidth ?? 180,
                                    maxWidth: meta.pxWidth ?? 180,
                                  }
                                : undefined
                            }
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          key={cell.id}
                          className={clsx(
                            meta.cellClassName,
                            isSticky && "sticky z-10 bg-white",
                            enableRowSelection &&
                              selected &&
                              "text-black dark:text-black bg-white"
                          )}
                          style={
                            isSticky
                              ? {
                                  left,
                                  minWidth: meta.pxWidth ?? 180,
                                  maxWidth: meta.pxWidth ?? 180,
                                }
                              : undefined
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsWithSelection.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {enablePagination && (
        <div className="mt-3 flex items-center justify-end gap-3 text-sm text-muted-foreground">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </span>
        </div>
      )}
    </div>
  );
}

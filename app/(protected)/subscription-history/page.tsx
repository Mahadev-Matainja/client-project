"use client";

import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CommonDataTable } from "@/components/CommonDataTable";
import MainLayout from "@/components/layout/main-layout";
import { fetchSubcriptionHistory } from "@/services/Subcription";
import TableSkeleton from "@/components/feature/TableSkeleton";
import { Calendar, ClipboardList, CreditCard, Eye, Hash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define subscription type
type Subscription = {
  serial_no: number;
  plan_name: string;
  price: string;
  start_date: string;
  end_date: string;
  purchase_date: string;
  current_plan: boolean;
  payment_method: string;
  transaction_id: string;
  order_id: string;
};

// ✅ Columns with conditional button color
const getColumns = (
  openDialog: (item: Subscription) => void
): ColumnDef<Subscription>[] => [
  {
    accessorKey: "serial_no",
    header: "#",
    cell: ({ getValue }) => <span>{getValue<number>()}</span>,
  },
  {
    accessorKey: "plan_name",
    header: "Plan Name",
    cell: ({ getValue }) => (
      <span className="font-semibold text-gray-800">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "purchase_date",
    header: "Purchase Date",
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
  },

  // ✅ Fix: row.original.current_plan (not row.current_plan)
  {
    accessorKey: "paymentDetails",
    header: "Info",
    cell: ({ row }) => {
      const isCurrentPlan = row.original.current_plan;

      return (
        <button
          onClick={() => openDialog(row.original)}
          className={`p-2 rounded-full transition cursor-pointer ${
            isCurrentPlan
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-100 text-blue-600"
          }`}
        >
          <Eye size={18} />
        </button>
      );
    },
  },
];

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Subscription[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [selectedRow, setSelectedRow] = useState<Subscription | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = (item: Subscription) => {
    setSelectedRow(item);
    setDialogOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchSubcriptionHistory();
        if (response?.data && Array.isArray(response.data)) {
          setData(response.data);
        } else {
          setError("Invalid API response format.");
        }
      } catch (err) {
        console.error("Error fetching subscription history:", err);
        setError("Failed to load subscription history.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-4 bg-[#F3F4F6] min-h-[calc(100vh-64px)] p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Subscription History
        </h1>
        <p className="text-gray-600">
          View all your subscription plans and details below.
        </p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {loading ? (
          <TableSkeleton rows={5} />
        ) : (
          <div className="overflow-x-auto mt-6">
            <CommonDataTable
              columns={getColumns(openDialog)}
              data={data}
              enableSearch
              enablePagination
              initialPageSize={10}
              getRowClassName={(row, index) => {
                const isCurrentPlan = row.current_plan;

                return isCurrentPlan
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : index % 2 === 0
                  ? "bg-gray-50 hover:bg-gray-100"
                  : "bg-white hover:bg-gray-50";
              }}
            />
          </div>
        )}

        {/* ✅ Dialog Popup for Subscription Details */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
            </DialogHeader>

            {selectedRow && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-start gap-3">
                  <CreditCard size={18} className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="font-medium text-gray-800">
                      {selectedRow.payment_method}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Hash size={18} className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Transaction ID</p>
                    <p className="font-medium text-gray-800">
                      {selectedRow.transaction_id}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ClipboardList size={18} className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-medium text-gray-800">
                      {selectedRow.order_id}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Purchase Date</p>
                    <p className="font-medium text-gray-800">
                      {selectedRow.purchase_date}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Page;

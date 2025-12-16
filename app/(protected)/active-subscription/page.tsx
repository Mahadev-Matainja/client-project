"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ColumnDef } from "@tanstack/react-table";
import { CommonDataTable } from "@/components/CommonDataTable";
import MainLayout from "@/components/layout/main-layout";
import TableSkeleton from "@/components/feature/TableSkeleton";
import { CheckCircle, PlusCircle, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  setLoading,
  setSubscriptions,
  setError,
} from "@/lib/slices/activeSubscriptionSlice";

import { fetchSubcriptionStatus, PlanChange } from "@/services/Subcription";
import { AppDispatch, RootState } from "@/lib/store";

type Subscription = {
  serial_no: number;
  plan_name: string;
  start_date: string | null;
  end_date: string | null;
  validity: string | null;
  status: number | null;
  id: number;
};

// Helper function
const formatDate = (dateString: string | null) => {
  if (!dateString) return "Null";
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? "Null"
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.subscription
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Subscription | null>(null);

  //  Fetch subscriptions and save to Redux
  const loadSubscriptions = async () => {
    dispatch(setLoading(true));
    try {
      const response = await fetchSubcriptionStatus();
      if (Array.isArray(response)) {
        dispatch(setSubscriptions(response));
      } else if (Array.isArray(response?.data)) {
        dispatch(setSubscriptions(response.data));
      } else {
        dispatch(setError("Invalid API response format"));
      }
    } catch (err) {
      console.error("Error fetching subscription status:", err);
      dispatch(setError("Failed to load subscription history."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  //  Open dialog
  const handleOpenDialog = (plan: Subscription) => {
    setSelectedPlan(plan);
    setOpenDialog(true);
  };

  //  Confirm activation
  const handleConfirm = async () => {
    if (selectedPlan) {
      try {
        await PlanChange({ package_id: selectedPlan.id });
        await loadSubscriptions(); //  Refresh data instantly
      } catch (error) {
        console.error("Activation error:", error);
      }
    }
    setOpenDialog(false);
  };

  //  Define table columns
  const columns: ColumnDef<Subscription>[] = [
    {
      accessorKey: "serial_no",
      header: "#",
      cell: ({ getValue }) => <span>{getValue<number>()}</span>,
    },
    {
      accessorKey: "plan_name",
      header: "Plan Name",
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue<string>()}</span>
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
      accessorKey: "start_date",
      header: "Start Date",
      cell: ({ getValue }) => (
        <span>{formatDate(getValue<string | null>())}</span>
      ),
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      cell: ({ getValue }) => (
        <span>{formatDate(getValue<string | null>())}</span>
      ),
    },
    {
      accessorKey: "validity",
      header: "Validity (Days)",
      cell: ({ getValue }) => <span>{getValue<string>() ?? "Null"}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue, row }) => {
        const value = getValue<number | null>();
        const plan = row.original;

        if (value === 1)
          return (
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <CheckCircle size={18} /> Activated
            </div>
          );

        if (value === 0)
          return (
            <div className="flex items-center gap-2 text-red-500 font-semibold">
              <Lock size={18} /> Deactivated
            </div>
          );

        // null → Clickable “Active”
        return (
          <div
            className="flex items-center gap-2 text-blue-600 font-semibold cursor-pointer hover:text-blue-800"
            onClick={() => handleOpenDialog(plan)}
          >
            <PlusCircle size={18} />
            Active
          </div>
        );
      },
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 bg-[#F3F4F6] min-h-[calc(100vh-64px)] p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Subscription Status
          </h1>
          <p className="text-gray-600 mt-1">
            Below are all your subscription plans. The package displayed at the
            top is the most recently purchased.
          </p>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {loading ? (
          <div className="mt-6">
            <TableSkeleton rows={5} />
          </div>
        ) : (
          <div className="overflow-x-auto mt-8">
            <CommonDataTable
              columns={columns}
              data={data}
              enableSearch
              enablePagination
              initialPageSize={10}
              getRowClassName={(_, index) =>
                index % 2 === 0
                  ? "bg-green-50 hover:bg-green-100"
                  : "bg-white hover:bg-green-50"
              }
            />
          </div>
        )}

        {/* Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="p-0 overflow-hidden">
            <div className="bg-[#00aad4] px-4 py-3">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Confirm Activation?
                </DialogTitle>
              </DialogHeader>
            </div>
            <div className="p-6 space-y-4">
              <DialogDescription className="text-gray-700">
                Are you sure you want to switch to{" "}
                <span className="font-semibold text-[#116e86]">
                  {selectedPlan?.plan_name}
                </span>
                ? Your current active package will be deactivated and cannot be
                reactivated again.
              </DialogDescription>
              <DialogFooter className="flex justify-end gap-3 pt-4">
                <DialogClose asChild>
                  <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 cursor-pointer">
                    Cancel
                  </button>
                </DialogClose>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                >
                  Yes, Confirm
                </button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Page;

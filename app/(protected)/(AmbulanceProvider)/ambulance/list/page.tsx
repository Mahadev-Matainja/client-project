"use client";

import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/main-layout";
import { AmbulanceList } from "@/@types/ambulance";
import SearchBar from "./components/SearchBar";
import AddAmbulanceButton from "./components/AddAmbulanceButton";
import AmbulanceTable from "./components/AmbulanceTable";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import {
  AmbulanceDelete,
  fetchAmbulanceList,
} from "@/services/EmergencyService";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function AmbulanceListPage() {
  const [data, setData] = useState<AmbulanceList[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState<AmbulanceList | null>(
    null
  );

  const router = useRouter();

  useEffect(() => {
    const loadAmbulances = async () => {
      try {
        const res = await fetchAmbulanceList();
        setData(res?.data || []);
      } catch (err) {
        console.error("Failed to fetch ambulance list:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAmbulances();
  }, []);

  const filteredData = data.filter((x) => {
    const query = search.toLowerCase();

    return (
      (x?.name || "").toLowerCase().includes(query) ||
      (x?.ambulance_no || "").toLowerCase().includes(query) ||
      (x?.phone || "").toLowerCase().includes(query) ||
      (x?.alt_phone || "").toLowerCase().includes(query) ||
      (x?.type || "").toLowerCase().includes(query) ||
      (x?.address || "").toLowerCase().includes(query)
    );
  });

  const handleDeleteClick = (item: AmbulanceList) => {
    setSelectedDelete(item);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await AmbulanceDelete(selectedDelete?.id!);

      toast({
        title: "Ambulance deleted",
        description: "The ambulance has been deleted successfully.",
        variant: "default",
      });

      setData((prev) => prev.filter((x) => x.id !== selectedDelete?.id)); // remove without reload
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setDeleteOpen(false);
    }
  };
  return (
    <MainLayout>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <SearchBar search={search} setSearch={setSearch} />
          <AddAmbulanceButton />
        </div>

        <AmbulanceTable
          data={filteredData}
          loading={loading}
          onEdit={(item) => router.push(`/ambulance/${item.id}/edit`)}
          onDelete={handleDeleteClick}
        />
      </div>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDelete={confirmDelete}
        name={selectedDelete?.name}
      />
    </MainLayout>
  );
}

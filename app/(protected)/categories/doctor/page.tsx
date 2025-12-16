"use client";

import DoctorSearch from "@/components/DoctorSearch";
import MainLayout from "@/components/layout/main-layout";
import { DoctorSerach } from "@/services/DoctorService";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

import ShimmerDoctorCard from "./ShimmerDoctorCard";

const DoctorList = () => {
  const router = useRouter();
  const { selectedOption, selectedCategoryId, searchText } = useSelector(
    (state: any) => state.doctorSearch
  );

  const [doctorData, setDoctorData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);

    try {
      const res = await DoctorSerach(
        selectedOption, // o
        selectedCategoryId, // c
        searchText // q
      );

      console.log(res);
      setDoctorData(res?.data || []);
      setLastPage(res?.last_page || 1);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [selectedOption, selectedCategoryId, searchText, currentPage]);

  return (
    <MainLayout>
      <DoctorSearch />

      <div className="mt-8 p-4 bg-[#e2edeb78] rounded-md">
        {doctorData.length !== 0 && (
          <h2 className="text-xl font-semibold text-center mb-8">
            Find the perfect match for your care needs
          </h2>
        )}

        {/* Shimmer Loader */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ShimmerDoctorCard key={index} />
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && doctorData.length === 0 && (
          <p className="text-center text-xl text-gray-600">
            No doctors found !!
          </p>
        )}

        {/* Doctor List */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctorData.map((doc: any, index: number) => (
              <div
                key={doc.id || doc.name + index}
                className="bg-white rounded-xl p-5 flex items-center shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => router.push("/categories/doctorDetails")}
              >
                <img
                  src={"/icon/Doctor.png"}
                  alt="doctor"
                  className="w-28 h-28 rounded-full"
                />

                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-blue-900">
                    {doc.name}
                  </h3>

                  <p className="text-gray-700">{doc?.category?.name}</p>
                  <p className="text-gray-700">{doc?.degree}</p>

                  {/* <p className="text-blue-600 cursor-pointer underline">
                    {doc?.email || ""}
                  </p>
                  <p className="text-gray-700 ">{doc?.mobile_no || ""}</p>

                  <p className="text-gray-700 ">{doc?.hospital_name || ""}</p>
                  <p className="text-gray-700  ">{doc?.address || ""}</p>

                  {doc.registration_code && (
                    <p className="text-sm text-gray-600 mt-1 italic">
                      Reg No: {doc.registration_code}
                    </p>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        )}

        {/*  Pagination */}
        {!loading && doctorData.length > 0 && (
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && setCurrentPage(currentPage - 1)
                    }
                    className="mr-7 w-9 h-9 flex items-center justify-center cursor-pointer"
                  />
                </PaginationItem>

                {/* Page Numbers */}
                {Array.from({ length: lastPage }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                        className="rounded-full w-9 h-9 flex items-center justify-center cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                {/* Next */}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < lastPage && setCurrentPage(currentPage + 1)
                    }
                    className="ml-4 w-9 h-9 flex items-center justify-center cursor-pointer"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DoctorList;

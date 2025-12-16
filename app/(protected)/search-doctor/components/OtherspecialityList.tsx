"use client";

import { DoctorCategories } from "@/services/DoctorService";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setSelectedCategoryId } from "@/lib/slices/doctorSearchSlice";

const OtherspecialityList = ({
  showAll,
  setShowAll,
  setShowSpecialities,
}: any) => {
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace("/api", "") || "";

  //  Fetch categories on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await DoctorCategories();
        setSpecialities(res?.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayedItems = showAll ? specialities : specialities.slice(0, 6);

  const handleSeeAll = () => {
    setShowAll(true);
    setShowSpecialities(true);
  };

  const handleCardClick = (id: number) => {
    dispatch(setSelectedCategoryId(id)); // store id in redux
    router.push(`/categories/doctor`); //  redirect
  };

  //  Shimmer skeleton card
  const SkeletonCard = () => (
    <div className="animate-pulse flex flex-col items-center text-center bg-white p-4 rounded-xl shadow-md border">
      <div className="w-[60px] h-[60px] bg-gray-300 rounded-full"></div>
      <div className="mt-3 w-20 h-3 bg-gray-300 rounded"></div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      {!showAll && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-center">
            Explore Other Specialities
          </h2>

          <button
            onClick={handleSeeAll}
            className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
          >
            See All Specialities
          </button>
        </div>
      )}

      {showAll ? (
        <div className="mt-4 p-4 bg-[#e2edeb78] rounded">
          <h2 className="text-base font-semibold text-center mb-4">
            Our Category
          </h2>

          <div className="gap-6 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? [...Array(12)].map((_, i) => <SkeletonCard key={i} />)
              : displayedItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex flex-col items-center text-center bg-white p-4 rounded-xl shadow-md border transition-all cursor-pointer hover:scale-[1.03] hover:shadow-xl hover:bg-gradient-to-br hover:from-[rgba(192,223,230,0.5)] hover:to-[rgba(255,255,255,0.7)]"
                    onClick={() => handleCardClick(item.id)}
                  >
                    <Image
                      src={
                        item?.image
                          ? `${BASE_URL}/${item.image}`
                          : "/fallback.png"
                      }
                      alt={item.name}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                    <p className="mt-2 text-sm font-medium">{item.name}</p>
                  </div>
                ))}
          </div>
        </div>
      ) : (
        <div className="gap-6 mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {loading
            ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
            : displayedItems.map((item: any) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center text-center bg-white p-4 rounded-xl shadow-md border transition-all cursor-pointer hover:scale-[1.03] hover:shadow-xl hover:bg-gradient-to-br hover:from-[rgba(192,223,230,0.5)] hover:to-[rgba(255,255,255,0.7)]"
                  onClick={() => handleCardClick(item.id)}
                >
                  <Image
                    src={
                      item?.image
                        ? `${BASE_URL}/${item.image}`
                        : "/fallback.png"
                    }
                    alt={item.name}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                  <p className="mt-2 text-sm font-medium">{item.name}</p>
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

export default OtherspecialityList;

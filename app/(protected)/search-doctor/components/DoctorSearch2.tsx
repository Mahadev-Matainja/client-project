"use clie02nt";

import MainLayout from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { BriefcaseMedical, Building2, Mail, Phone } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

/* ---------------------------------- TYPES --------------------------------- */

type SearchMode = "doctor" | "clinic";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  location: string;
  qualification: string;
  experience: string;
};

type Clinic = {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  services: string[];
  contactInfo: {
    phone?: string;
    email?: string;
    address?: string;
  }[];
};

/* ---------------------------------- DATA ---------------------------------- */

const dummyDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. John Doe",
    specialty: "Cardiologist",
    avatar: "",
    location: "Mosscow, Russia",
    qualification: "MBBS",
    experience: "5 years",
  },
  {
    id: "2",
    name: "Dr. Jane Smith",
    specialty: "Dermatologist",
    avatar: "",
    location: "Mumbai, India",
    qualification: "MBBS(Cambridge university), MD",
    experience: "5 years",
  },
  {
    id: "3",
    name: "Dr. Emily Johnson",
    specialty: "Pediatrician",
    avatar: "",
    location: "Amsterdam, Netherlands",
    qualification: "MBBS(London University, London), DCH",
    experience: "5 years",
  },
  {
    id: "4",
    name: "Dr. Michael Brown",
    specialty: "Neurologist",
    avatar: "",
    location: "Jaipur India",
    qualification: "MBBS, MD, DM",
    experience: "5 years",
  },
  {
    id: "5",
    name: "Dr. Sarah Davis",
    specialty: "Oncologist",
    avatar: "",
    location: "delhi India",
    qualification: "MBBS, MD",
    experience: "5 years",
  },
  {
    id: "6",
    name: "Dr. John Doe",
    specialty: "Cardiologist",
    avatar: "",
    location: "Mosscow, Russia",
    qualification: "MBBS",
    experience: "5 years",
  },
  {
    id: "7",
    name: "Dr. Jane Smith",
    specialty: "Dermatologist",
    avatar: "",
    location: "Mumbai, India",
    qualification: "MBBS(Cambridge university), MD",
    experience: "5 years",
  },
  {
    id: "8",
    name: "Dr. Emily Johnson",
    specialty: "Pediatrician",
    avatar: "",
    location: "Amsterdam, Netherlands",
    qualification: "MBBS(London University, London), DCH",
    experience: "5 years",
  },
  {
    id: "9",
    name: "Dr. Michael Brown",
    specialty: "Neurologist",
    avatar: "",
    location: "Jaipur India",
    qualification: "MBBS, MD, DM",
    experience: "5 years",
  },
  {
    id: "10",
    name: "Dr. Sarah Davis",
    specialty: "Oncologist",
    avatar: "",
    location: "delhi India",
    qualification: "MBBS, MD",
    experience: "5 years",
  },
  {
    id: "11",
    name: "Dr. John Doe",
    specialty: "Cardiologist",
    avatar: "",
    location: "Mosscow, Russia",
    qualification: "MBBS",
    experience: "5 years",
  },
  {
    id: "12",
    name: "Dr. Jane Smith",
    specialty: "Dermatologist",
    avatar: "",
    location: "Mumbai, India",
    qualification: "MBBS(Cambridge university), MD",
    experience: "5 years",
  },
  {
    id: "13",
    name: "Dr. Emily Johnson",
    specialty: "Pediatrician",
    avatar: "",
    location: "Amsterdam, Netherlands",
    qualification: "MBBS(London University, London), DCH",
    experience: "5 years",
  },
  {
    id: "14",
    name: "Dr. Michael Brown",
    specialty: "Neurologist",
    avatar: "",
    location: "Jaipur India",
    qualification: "MBBS, MD, DM",
    experience: "5 years",
  },
  {
    id: "15",
    name: "Dr. Sarah Davis",
    specialty: "Oncologist",
    avatar: "",
    location: "delhi India",
    qualification: "MBBS, MD",
    experience: "5 years",
  },
];

const dummyClinics: Clinic[] = [
  {
    id: "1",
    name: "City Health Clinic",
    specialty: "General Medicine",
    avatar: "",
    services: ["General Checkup", "Vaccinations", "Health Screenings"],
    contactInfo: [
      {
        phone: "+1 123-456-7890",
        email: "clinic1@gmail.com",
        address: "123 Main St, New York, NY 10001(Head Office)",
      },
    ],
  },
  {
    id: "2",
    name: "Sunrise Dental Care",
    specialty: "Dentistry",
    avatar: "",
    services: ["Teeth Cleaning", "Fillings", "Orthodontics"],
    contactInfo: [
      {
        phone: "+1 123-456-7890",
        email: "clinic1@gmail.com",
        address: "123 Main St, New York, NY 10001",
      },
      {
        phone: "+1 124-456-7890",
        email: "clinic2@gmail.com",
        address: "123 Main St, Chicago, NY 10001",
      },
      {
        phone: "+1 129-456-7890",
        email: "clinic3@gmail.com",
        address: "123 Main St, Los angeles, NY 10001",
      },
    ],
  },
  {
    id: "3",
    name: "Wellness Eye Center",
    specialty: "Ophthalmology",
    avatar: "",
    services: ["Eye Exams", "Contact Lenses", "LASIK Surgery"],
    contactInfo: [
      {
        phone: "+1 123-456-7890",
        email: "clinic1@gmail.com",
        address: "123 Main St, New York, NY 10001",
      },
      {
        phone: "+1 123-456-7899",
        email: "clinic2@gmail.com",
        address: "123 Main St, California, NY 10001",
      },
    ],
  },
];

/* ------------------------------- UI HELPERS ------------------------------- */

const InfoRow = ({
  icon,
  text,
  title,
}: {
  icon: React.ReactNode;
  text?: string;
  title?: string;
}) => (
  <div className="flex items-center gap-2 min-w-0">
    <span className="flex-shrink-0">{icon}</span>
    <span className="truncate text-sm text-gray-600" title={title ?? text}>
      {text ?? "—"}
    </span>
  </div>
);

/* --------------------------------- CARDS ---------------------------------- */

const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
  <div
    className="rounded-xl border bg-white text-card-foreground shadow-sm hover:shadow-lg transition-shadow focus-within:ring-2 ring-blue-200"
    key={doctor.id}
  >
    <div className="p-5">
      <div className="flex gap-4">
        <div className="relative flex-shrink-0">
          <img
            alt={doctor.name}
            loading="lazy"
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover ring-4 ring-teal-50 bg-teal-50"
            src={doctor.avatar || "/noProfileImage.png"}
          />
        </div>

        <div className="flex-1 min-w-0">
          <Link href={"#"}>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {doctor.name}
            </h3>
          </Link>

          <p className="text-teal-600 font-medium">{doctor.specialty}</p>

          <div className="mt-2 flex flex-col gap-1">
            <InfoRow
              icon={<Building2 className="h-4 w-4 text-gray-500" />}
              text={doctor.qualification}
              title={doctor.qualification}
            />
            <InfoRow
              icon={<BriefcaseMedical className="h-4 w-4 text-gray-500" />}
              text={doctor.experience}
              title={doctor.experience}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href={"#"}>
          <button
            type="button"
            className="h-9 px-3 rounded-md border border-input bg-background hover:bg-gray-50 transition"
          >
            View Profile
          </button>
        </Link>
      </div>
    </div>
  </div>
);

const ClinicCard = ({ clinic }: { clinic: Clinic }) => {
  const primary = clinic.contactInfo?.[0];
  return (
    <div
      className="rounded-xl border bg-white text-card-foreground shadow-sm hover:shadow-lg transition-shadow focus-within:ring-2 ring-blue-200"
      key={clinic.id}
    >
      <div className="p-5">
        <div className="flex gap-4">
          <div className="relative flex-shrink-0">
            <img
              alt={clinic.name}
              loading="lazy"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-teal-50 bg-teal-50"
              src={clinic.avatar || "/noProfileImage.png"}
            />
          </div>

          <div className="flex-1 min-w-0">
            <Link href={"#"}>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {clinic.name}
              </h3>
            </Link>

            <p className="text-teal-600 font-medium">{clinic.specialty}</p>

            <div className="mt-2 flex flex-wrap gap-2">
              {(clinic.services ?? []).slice(0, 4).map((s, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                >
                  {s}
                </span>
              ))}
              {clinic.services && clinic.services.length > 4 && (
                <span className="text-xs text-gray-500">
                  +{clinic.services.length - 4} more
                </span>
              )}
            </div>

            {primary && (
              <div className="mt-3 grid gap-1">
                {primary.address && (
                  <InfoRow
                    icon={<Building2 className="h-4 w-4 text-gray-500" />}
                    text={primary.address}
                    title={primary.address}
                  />
                )}
                {primary.phone && (
                  <InfoRow
                    icon={<Phone className="h-4 w-4 text-gray-500" />}
                    text={primary.phone}
                  />
                )}
                {primary.email && (
                  <InfoRow
                    icon={<Mail className="h-4 w-4 text-gray-500" />}
                    text={primary.email}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link href={"#"}>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 transition"
            >
              View Details
            </button>
          </Link>
          <Link href={"#"}>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium h-9 rounded-md px-3 transition bg-blue-600 text-white hover:bg-blue-700"
            >
              Book Appointment
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------- PAGINATION WIDGET --------------------------- */

function Pagination({
  page,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const go = (p: number) => {
    const np = Math.min(Math.max(1, p), totalPages);
    if (np !== page) onChange(np);
  };

  // number buttons (compact)
  const pages: number[] = [];
  const add = (n: number) => pages.push(n);
  const window = 1; // buttons around current
  add(1);
  for (
    let i = Math.max(2, page - window);
    i <= Math.min(totalPages - 1, page + window);
    i++
  )
    add(i);
  if (totalPages > 1) add(totalPages);
  const unique = Array.from(new Set(pages)).sort((a, b) => a - b);

  return (
    <div className="flex items-center justify-center gap-2 mt-6 select-none">
      <button
        className="px-3 py-1.5 border rounded-md disabled:opacity-50"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        Prev
      </button>
      {unique.map((n, idx) => {
        const prev = unique[idx - 1];
        const showEllipsis = idx > 0 && n - (prev ?? 0) > 1;
        return (
          <React.Fragment key={n}>
            {showEllipsis && <span className="px-1 text-gray-500">…</span>}
            <button
              className={`px-3 py-1.5 border rounded-md ${
                n === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => go(n)}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </button>
          </React.Fragment>
        );
      })}
      <button
        className="px-3 py-1.5 border rounded-md disabled:opacity-50"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}

/* ---------------------------------- PAGE ---------------------------------- */

export default function DoctorSearch() {
  // raw inputs
  const [searchDoctor, setSearchDoctor] = useState<string>("");
  const [searchClinic, setSearchClinic] = useState<string>("");
  const [searchMode, setSearchMode] = useState<SearchMode>("doctor");

  // search execution state
  const [loading, setLoading] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  // results stored ONLY after clicking Search
  const [doctorResults, setDoctorResults] = useState<Doctor[]>([]);
  const [clinicResults, setClinicResults] = useState<Clinic[]>([]);

  // pagination
  const [page, setPage] = useState<number>(1);
  const pageSize = 6;

  // reset when mode changes
  useEffect(() => {
    setSearchDoctor("");
    setSearchClinic("");
    setDoctorResults([]);
    setClinicResults([]);
    setLoading("idle");
    setPage(1);
  }, [searchMode]);

  const canSearch =
    (searchMode === "doctor" ? searchDoctor : searchClinic).trim().length > 0;

  const runSearch = async () => {
    if (!canSearch) return;
    setLoading("loading");

    try {
      // ✅ Replace this block with your API call later
      const sd = searchDoctor.trim().toLowerCase();
      const sc = searchClinic.trim().toLowerCase();

      // api call

      // mock filtering
      if (searchMode === "doctor") {
        const filtered = dummyDoctors.filter((d) => {
          if (!sd) return false;
          return (
            d.name.toLowerCase().includes(sd) ||
            d.specialty.toLowerCase().includes(sd) ||
            d.location.toLowerCase().includes(sd) ||
            d.qualification.toLowerCase().includes(sd)
          );
        });
        setDoctorResults(filtered);
        setClinicResults([]); // clear other
      } else {
        const filtered = dummyClinics.filter((c) => {
          if (!sc) return false;
          const servicesMatch = c.services.some((s) =>
            s.toLowerCase().includes(sc)
          );
          const contactMatch = c.contactInfo.some(
            (info) =>
              info.address?.toLowerCase().includes(sc) ||
              info.phone?.toLowerCase().includes(sc) ||
              info.email?.toLowerCase().includes(sc)
          );
          return (
            c.name.toLowerCase().includes(sc) ||
            c.specialty.toLowerCase().includes(sc) ||
            servicesMatch ||
            contactMatch
          );
        });
        setClinicResults(filtered);
        setDoctorResults([]); // clear other
      }

      setPage(1); // reset to first page on new search
      // simulate latency
      setTimeout(() => setLoading("success"), 150);
    } catch (e) {
      setLoading("error");
    }
  };

  const clearSearch = () => {
    setSearchDoctor("");
    setSearchClinic("");
    setDoctorResults([]);
    setClinicResults([]);
    setLoading("idle");
    setPage(1);
  };

  // derive current page slice
  const total =
    searchMode === "doctor" ? doctorResults.length : clinicResults.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIdx = (page - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentItems =
    searchMode === "doctor"
      ? doctorResults.slice(startIdx, endIdx)
      : clinicResults.slice(startIdx, endIdx);

  return (
    <MainLayout>
      <div className="h-full">
        {/* Header */}
        <div className="text-center text-2xl font-bold mx-auto mt-5 space-y-4">
          <div className="text-4xl font-extrabold">
            Need a doctor <span className="text-red-500">nearby</span>?
          </div>
          <div className="opacity-50">
            Your health is our priority. Explore the best doctor’s schedule and
            clinic availability around your location.
          </div>
        </div>

        {/* Search */}
        <div className="mt-10 flex justify-center">
          <select
            className="p-3 border border-gray-300 rounded-l-md focus:outline-none bg-white"
            value={searchMode}
            onChange={(e) => setSearchMode(e.target.value as SearchMode)}
          >
            <option value="doctor">Doctor</option>
            <option value="clinic">Clinic</option>
          </select>

          <input
            type="text"
            placeholder={
              searchMode === "doctor"
                ? "Search by doctor name, specialty, location..."
                : "Search by clinic name, specialty, service, email, phone..."
            }
            className="w-2/5 p-3 border-t border-b border-gray-300 focus:outline-none bg-white"
            value={searchMode === "doctor" ? searchDoctor : searchClinic}
            onChange={(e) => {
              // NOTE: typing doesn't trigger search; we only update the input state
              if (searchMode === "doctor") setSearchDoctor(e.target.value);
              else setSearchClinic(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSearch && loading !== "loading")
                runSearch();
            }}
          />

          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-r-md hover:bg-blue-600 disabled:opacity-60 cursor-pointer"
            onClick={runSearch}
            disabled={loading === "loading" || !canSearch}
          >
            {loading === "loading" ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Results meta */}
        {loading === "success" && (
          <div className="mt-3 text-sm text-gray-600 text-center">
            {searchMode === "doctor"
              ? `${total} doctor${total !== 1 ? "s" : ""} found`
              : `${total} clinic${total !== 1 ? "s" : ""} found`}
            {total > 0 && totalPages > 1
              ? ` • Page ${page} of ${totalPages}`
              : ""}
            {total > 0 && (
              <button
                className="ml-3 text-blue-600 hover:underline"
                onClick={clearSearch}
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Accessible status */}
        <div aria-live="polite" className="sr-only">
          {loading === "loading"
            ? "Searching…"
            : loading === "success"
            ? "Search complete"
            : ""}
        </div>

        {/* Result grid */}
        <div className="mt-10 mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
            {loading === "idle" && (
              <div className="col-span-full text-center text-gray-500 border rounded-lg p-8">
                {searchMode === "doctor"
                  ? "Start by searching a doctor's name, specialty, or location."
                  : "Search a clinic by name, specialty, service, or contact info."}
              </div>
            )}

            {loading === "loading" &&
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border p-5">
                  <Skeleton className="h-6 w-1/2 mb-3 bg-gray-300" />
                  <Skeleton className="h-4 w-1/3 mb-6 bg-gray-300" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-24 w-24 rounded-full bg-gray-300" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2 bg-gray-300" />
                      <Skeleton className="h-4 w-1/2 bg-gray-300" />
                    </div>
                  </div>
                </div>
              ))}

            {loading === "success" && total === 0 && (
              <div className="col-span-full text-center text-gray-500 border rounded-lg p-8">
                {searchMode === "doctor"
                  ? "No doctors found matching your search."
                  : "No clinics found matching your search."}
              </div>
            )}

            {loading === "success" &&
              searchMode === "doctor" &&
              currentItems.map((d) => (
                <DoctorCard key={d.id} doctor={d as Doctor} />
              ))}

            {loading === "success" &&
              searchMode === "clinic" &&
              currentItems.map((c) => (
                <ClinicCard key={c.id} clinic={c as Clinic} />
              ))}

            {loading === "error" && (
              <div className="col-span-full text-center text-red-500 border rounded-lg p-8">
                An error occurred while searching. Please try again.
              </div>
            )}
          </div>

          {/* Pagination */}
          {loading === "success" && total > 0 && (
            <Pagination
              page={page}
              total={total}
              pageSize={pageSize}
              onChange={setPage}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}

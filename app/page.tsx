"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Loader from "@/components/ui/loader";
import HomePageDashboard from "./(public)/page";
import CookieConsent from "./Cookies";

export default function HomePage() {
  const { status } = useSession();

  if (status === "loading") return <Loader />;

  if (
    status === "authenticated" &&
    sessionStorage.getItem("doctorLogin") &&
    sessionStorage.getItem("doctorLogin") === "true"
  ) {
    redirect("/doctor/dashboard");
  }

  if (status === "authenticated") {
    redirect("/dashboard"); // ✅ send logged-in users to dashboard
    return null;
  }

  return (
    <>
      <CookieConsent />
      <HomePageDashboard />
    </>
  );
}

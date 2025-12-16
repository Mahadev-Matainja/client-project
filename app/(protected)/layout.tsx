"use client";

import Loader from "@/components/ui/loader";
import { useSession } from "next-auth/react";
import { notFound, redirect } from "next/navigation";
import React from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loader />;

  if (status === "unauthenticated") {
    redirect("/");
    return null;
  }

  return <>{children}</>;
}

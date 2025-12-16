"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setAccessToken } from "@/utils/api";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    setAccessToken(session?.user?.data?.token ?? null);
  }, [session]);

  return <>{children}</>;
}

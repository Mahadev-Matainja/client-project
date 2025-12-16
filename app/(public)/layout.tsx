"use client";

import Loader from "@/components/ui/loader";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";

function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  const { status } = useSession();

  if (status === "loading") {
    return <Loader />;
  }

  // if (status === "authenticated") {
  //   return notFound();
  // }

  return <main>{children}</main>;
}

export default Layout;

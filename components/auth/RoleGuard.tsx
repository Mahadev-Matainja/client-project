import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
  allowedSubTypes?: string[];
}

export default async function RoleGuard({
  children,
  allowedRoles,
  allowedSubTypes,
}: RoleGuardProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const customer = session.user?.data?.customer;
  const role = customer?.type;
  const subType = customer?.subType;

  // Role validation
  if (allowedRoles && !allowedRoles.includes(role ?? "")) {
    redirect("/unauthorized");
  }

  // SubType validation
  if (allowedSubTypes && !allowedSubTypes.includes(subType ?? "")) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}

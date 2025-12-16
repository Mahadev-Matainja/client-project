import RoleGuard from "@/components/auth/RoleGuard";

export default function AmbulaceProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard
      allowedRoles={["customer"]}
      allowedSubTypes={["ambulance"]} // <-- FIXED
    >
      {children}
    </RoleGuard>
  );
}

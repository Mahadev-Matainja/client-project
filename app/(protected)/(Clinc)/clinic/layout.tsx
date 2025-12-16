import RoleGuard from "@/components/auth/RoleGuard";

export default function ClinicProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard
      allowedRoles={["customer"]}
      allowedSubTypes={["clinic"]} // <-- FIXED
    >
      {children}
    </RoleGuard>
  );
}

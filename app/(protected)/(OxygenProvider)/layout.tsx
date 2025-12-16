import RoleGuard from "@/components/auth/RoleGuard";

export default function OxygenProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard
      allowedRoles={["customer"]}
      allowedSubTypes={["oxygen"]} // <-- FIXED
    >
      {children}
    </RoleGuard>
  );
}

import RoleGuard from "@/components/auth/RoleGuard";
import MainLayout from "@/components/layout/main-layout";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard
      allowedRoles={["doctor"]}
      allowedSubTypes={[
        "doctor",
        "dietitian",
        "sample_collector",
        "physiotherapist",
      ]}
    >
      <MainLayout>{children}</MainLayout>
    </RoleGuard>
  );
}

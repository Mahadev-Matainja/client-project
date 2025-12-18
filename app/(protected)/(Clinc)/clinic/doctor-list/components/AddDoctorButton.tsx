"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AddDoctorButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push("/clinic/add-docror")}
      className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
    >
      Add Doctor
    </Button>
  );
}

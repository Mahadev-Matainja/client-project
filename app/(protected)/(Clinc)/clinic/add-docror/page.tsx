"use client";
import React, { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DoctorForm } from "./components/DoctorForm";
import { ScheduleDialog } from "./components/ScheduleDialog";
import { useRouter } from "next/navigation";

const doctors = [
  { id: 1, name: "Dr. Amit Sharma" },
  { id: 2, name: "Dr. Riya Das" },
  { id: 3, name: "Dr. John Paul" },
];

const initialAvailability = [
  { id: 1, day: "Monday", from: "09:00", to: "17:00" },
  { id: 2, day: "Wednesday", from: "10:00", to: "18:00" },
  { id: 3, day: "Friday", from: "08:00", to: "16:00" },
];

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    doctorId: "",
    priority: "" as number | "",
    status: "",
    remark: "",
  });
  const [availability, setAvailability] = useState(initialAvailability);

  const handleSave = () => {
    console.log("Combined Doctor Data:", { ...formData, availability });
  };

  // const handleCancel = () => console.log("Cancelled");

  const handleInputChange = (field: string, value: string) => {
    if (field === "priority") {
      setFormData((prev) => ({
        ...prev,
        [field]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Add Doctor for Clinic
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 py-4 px-6">
            <DoctorForm
              formData={formData}
              onChange={handleInputChange}
              doctors={doctors}
            />
            <ScheduleDialog
              availability={availability}
              setAvailability={setAvailability}
            />
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="px-6 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="px-8 bg-indigo-600 hover:bg-blue-700 cursor-pointer "
              >
                Save Doctor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Page;

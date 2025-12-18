"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface DoctorFormProps {
  formData: {
    doctorId: string;
    status: string;
    priority: number | "";
    remark?: string;
  };
  onChange: (field: string, value: any) => void;
  doctors: { id: number; name: string }[];
}

export const DoctorForm: React.FC<DoctorFormProps> = ({
  formData,
  onChange,
  doctors,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Doctor */}
      <div className="space-y-3">
        <Label className="font-semibold text-gray-700">
          Doctor <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.doctorId}
          onValueChange={(value) => onChange("doctorId", value)}
        >
          <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue placeholder="Select doctor" />
          </SelectTrigger>
          <SelectContent>
            {doctors.map((doc) => (
              <SelectItem key={doc.id} value={String(doc.id)}>
                {doc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="space-y-3">
        <Label className="font-semibold text-gray-700">
          Status <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.status}
          onValueChange={(value) => onChange("status", value)}
        >
          <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Online">Online</SelectItem>
            <SelectItem value="Offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Priority */}
      <div className="space-y-3">
        <Label className="font-semibold text-gray-700">
          Priority <span className="text-red-500">*</span>
        </Label>
        <Input
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          placeholder="Enter priority (1, 2, 3...)"
          value={formData.priority}
          onChange={(e) =>
            onChange(
              "priority",
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
          className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div></div>

      {/* Remark */}
      <div className="md:col-span-2 space-y-3">
        <Label className="font-semibold text-gray-700">Remark (Optional)</Label>
        <Textarea
          value={formData.remark}
          onChange={(e) => onChange("remark", e.target.value)}
          placeholder="Add any note or description..."
          className="min-h-[100px] resize-none border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

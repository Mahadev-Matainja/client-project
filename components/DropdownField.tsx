"use client";
import { AmbulanceForm } from "@/@types/ambulance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DropdownFieldProps {
  label: string;
  name: string;
  value: string;
  setForm: React.Dispatch<React.SetStateAction<AmbulanceForm>>;
  error?: string;
  onValueChange?: (value: string) => void;
}

export default function DropdownField({
  label,
  name,
  value,
  setForm,
  error,
  onValueChange,
}: DropdownFieldProps) {
  return (
    <div className="space-y-2">
      <Label className={error ? "text-red-500" : ""}>{label}</Label>
      <Select
        value={value}
        onValueChange={(value) => {
          if (onValueChange) {
            onValueChange(value);
          } else {
            setForm((prev) => ({ ...prev, [name]: value }));
          }
        }}
      >
        <SelectTrigger className={`w-full ${error ? "border-red-500" : ""}`}>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Yes</SelectItem>
          <SelectItem value="0">No</SelectItem>
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

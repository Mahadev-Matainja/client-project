"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import FormHeader from "./FormHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/lib/store";
import { updateHealth } from "@/lib/slices/signupSlice";
import { validateHealth } from "../utils/validation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";

const chronicDiseaseOptions = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Asthma",
  "Arthritis",
  "Cancer",
  "Kidney Disease",
  "Liver Disease",
  "Thyroid Disorders",
  "Mental Health Conditions",
  "Neurological Disorders",
  "Other",
];

export default function Step3Health({
  step,
  setStep,
}: {
  step: number;
  setStep: (n: number) => void;
}) {
  const dispatch = useDispatch();
  const saved = useSelector((s: RootState) => s.signup.patient.health);

  const [form, setForm] = React.useState({
    ChronicDisease: saved.ChronicDisease ?? "",
    diseaseList: saved.diseaseList ?? [],
    Medications: saved.Medications ?? "",
    Allergies: saved.Allergies ?? "",
    EmergencyName: saved.EmergencyName ?? "",
    EmergencyPhone: saved.EmergencyPhone ?? "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function updateField(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" })); // clear error live
  }

  function toggleDisease(disease: string, checked: boolean) {
    updateField(
      "diseaseList",
      checked
        ? [...form.diseaseList, disease]
        : form.diseaseList.filter((d: any) => d !== disease)
    );
  }

  function onNext() {
    const validation = validateHealth(form);

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return; // stop
    }

    dispatch(updateHealth(form));
    setStep(4);
  }

  return (
    <div className="space-y-6">
      {/* Chronic Disease Yes / No */}
      <div className="space-y-2">
        <Label>Do you have any chronic diseases?</Label>
        <Select
          value={form.ChronicDisease}
          onValueChange={(val) => updateField("ChronicDisease", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>

        {errors.ChronicDisease && (
          <p className="text-red-500 text-sm">{errors.ChronicDisease}</p>
        )}
      </div>

      {/* Disease List */}
      {form.ChronicDisease === "yes" && (
        <div className="space-y-2">
          <Label>Select your chronic conditions</Label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
            {chronicDiseaseOptions.map((disease) => (
              <label key={disease} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.diseaseList.includes(disease)}
                  onChange={(e) => toggleDisease(disease, e.target.checked)}
                />
                <span>{disease}</span>
              </label>
            ))}
          </div>

          {errors.diseaseList && (
            <p className="text-red-500 text-sm">{errors.diseaseList}</p>
          )}
        </div>
      )}

      {/* Medications */}
      <div className="space-y-2">
        <Label>Current Medications (Optional)</Label>
        <Textarea
          value={form.Medications}
          onChange={(e) => updateField("Medications", e.target.value)}
        />
      </div>

      {/* Allergies */}
      <div className="space-y-2">
        <Label>Known Allergies (Optional)</Label>
        <Textarea
          value={form.Allergies}
          onChange={(e) => updateField("Allergies", e.target.value)}
        />
      </div>

      {/* Emergency Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Emergency Contact Name <span className="text-red-500">*</span>
          </Label>
          <Input
            value={form.EmergencyName}
            onChange={(e) => updateField("EmergencyName", e.target.value)}
          />
          {errors.EmergencyName && (
            <p className="text-red-500 text-sm">{errors.EmergencyName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            Emergency Contact Phone <span className="text-red-500">*</span>
          </Label>
          <div className="flex">
            <span className="flex items-center justify-center bg-gray-200 text-gray-700 px-3 rounded-l-md border">
              +91
            </span>
            <Input
              value={form.EmergencyPhone}
              onChange={(e) => updateField("EmergencyPhone", e.target.value)}
              maxLength={10}
              placeholder="1234567890"
              className="rounded-l-none"
            />
          </div>
          {errors.EmergencyPhone && (
            <p className="text-red-500 text-sm">{errors.EmergencyPhone}</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setStep(2)}
          className="flex items-center"
        >
          <ChevronLeft size={16} className="mr-2" />
          Back
        </Button>

        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}

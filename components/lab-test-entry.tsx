"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  ChevronRight,
  Save,
  FileText,
  ImageIcon,
  Check,
  Calendar,
  Clock,
} from "lucide-react";

interface BloodTestParameter {
  id: string;
  name: string;
  unit: string;
  normalRange: string;
  category: string;
}

interface BloodTestGroup {
  id: string;
  name: string;
  icon: string;
  parameters: BloodTestParameter[];
}

interface SavedTest {
  id: string;
  groupName: string;
  parameterName: string;
  value: string;
  unit: string;
  normalRange: string;
  status: "normal" | "high" | "low" | "pending";
  description: string;
  image: string | null;
  date: string;
  timestamp: string;
}

const bloodTestGroups: BloodTestGroup[] = [
  {
    id: "cbc",
    name: "Complete Blood Count (CBC)",
    icon: "🩸",
    parameters: [
      {
        id: "hemoglobin",
        name: "Hemoglobin",
        unit: "g/dL",
        normalRange: "12.0-16.0",
        category: "RBC",
      },
      {
        id: "hematocrit",
        name: "Hematocrit",
        unit: "%",
        normalRange: "36-46",
        category: "RBC",
      },
      {
        id: "rbc_count",
        name: "RBC Count",
        unit: "million/μL",
        normalRange: "4.2-5.4",
        category: "RBC",
      },
      {
        id: "wbc_count",
        name: "WBC Count",
        unit: "K/μL",
        normalRange: "4.0-11.0",
        category: "WBC",
      },
      {
        id: "neutrophils",
        name: "Neutrophils",
        unit: "%",
        normalRange: "50-70",
        category: "WBC",
      },
      {
        id: "lymphocytes",
        name: "Lymphocytes",
        unit: "%",
        normalRange: "20-40",
        category: "WBC",
      },
      {
        id: "monocytes",
        name: "Monocytes",
        unit: "%",
        normalRange: "2-8",
        category: "WBC",
      },
      {
        id: "eosinophils",
        name: "Eosinophils",
        unit: "%",
        normalRange: "1-4",
        category: "WBC",
      },
      {
        id: "basophils",
        name: "Basophils",
        unit: "%",
        normalRange: "0.5-1",
        category: "WBC",
      },
      {
        id: "platelets",
        name: "Platelets",
        unit: "K/μL",
        normalRange: "150-450",
        category: "Platelets",
      },
      {
        id: "mcv",
        name: "MCV",
        unit: "fL",
        normalRange: "80-100",
        category: "RBC Indices",
      },
      {
        id: "mch",
        name: "MCH",
        unit: "pg",
        normalRange: "27-32",
        category: "RBC Indices",
      },
      {
        id: "mchc",
        name: "MCHC",
        unit: "g/dL",
        normalRange: "32-36",
        category: "RBC Indices",
      },
    ],
  },
  {
    id: "lipid",
    name: "Lipid Profile",
    icon: "💧",
    parameters: [
      {
        id: "total_cholesterol",
        name: "Total Cholesterol",
        unit: "mg/dL",
        normalRange: "<200",
        category: "Cholesterol",
      },
      {
        id: "hdl_cholesterol",
        name: "HDL Cholesterol",
        unit: "mg/dL",
        normalRange: ">40",
        category: "Cholesterol",
      },
      {
        id: "ldl_cholesterol",
        name: "LDL Cholesterol",
        unit: "mg/dL",
        normalRange: "<100",
        category: "Cholesterol",
      },
      {
        id: "triglycerides",
        name: "Triglycerides",
        unit: "mg/dL",
        normalRange: "<150",
        category: "Lipids",
      },
      {
        id: "vldl",
        name: "VLDL",
        unit: "mg/dL",
        normalRange: "<30",
        category: "Cholesterol",
      },
      {
        id: "tc_hdl_ratio",
        name: "TC/HDL Ratio",
        unit: "ratio",
        normalRange: "<4.0",
        category: "Ratios",
      },
    ],
  },
  {
    id: "liver",
    name: "Liver Function Tests (LFT)",
    icon: "🫀",
    parameters: [
      {
        id: "alt",
        name: "ALT (SGPT)",
        unit: "U/L",
        normalRange: "7-56",
        category: "Enzymes",
      },
      {
        id: "ast",
        name: "AST (SGOT)",
        unit: "U/L",
        normalRange: "10-40",
        category: "Enzymes",
      },
      {
        id: "alp",
        name: "Alkaline Phosphatase",
        unit: "U/L",
        normalRange: "44-147",
        category: "Enzymes",
      },
      {
        id: "total_bilirubin",
        name: "Total Bilirubin",
        unit: "mg/dL",
        normalRange: "0.3-1.2",
        category: "Bilirubin",
      },
      {
        id: "direct_bilirubin",
        name: "Direct Bilirubin",
        unit: "mg/dL",
        normalRange: "0.0-0.3",
        category: "Bilirubin",
      },
      {
        id: "indirect_bilirubin",
        name: "Indirect Bilirubin",
        unit: "mg/dL",
        normalRange: "0.2-0.8",
        category: "Bilirubin",
      },
      {
        id: "total_protein",
        name: "Total Protein",
        unit: "g/dL",
        normalRange: "6.0-8.3",
        category: "Proteins",
      },
      {
        id: "albumin",
        name: "Albumin",
        unit: "g/dL",
        normalRange: "3.5-5.0",
        category: "Proteins",
      },
      {
        id: "globulin",
        name: "Globulin",
        unit: "g/dL",
        normalRange: "2.3-3.4",
        category: "Proteins",
      },
    ],
  },
  {
    id: "kidney",
    name: "Kidney Function Tests (KFT)",
    icon: "🫘",
    parameters: [
      {
        id: "creatinine",
        name: "Creatinine",
        unit: "mg/dL",
        normalRange: "0.7-1.3",
        category: "Waste Products",
      },
      {
        id: "urea",
        name: "Urea",
        unit: "mg/dL",
        normalRange: "7-20",
        category: "Waste Products",
      },
      {
        id: "bun",
        name: "BUN",
        unit: "mg/dL",
        normalRange: "6-24",
        category: "Waste Products",
      },
      {
        id: "uric_acid",
        name: "Uric Acid",
        unit: "mg/dL",
        normalRange: "3.4-7.0",
        category: "Waste Products",
      },
      {
        id: "sodium",
        name: "Sodium",
        unit: "mEq/L",
        normalRange: "136-145",
        category: "Electrolytes",
      },
      {
        id: "potassium",
        name: "Potassium",
        unit: "mEq/L",
        normalRange: "3.5-5.1",
        category: "Electrolytes",
      },
      {
        id: "chloride",
        name: "Chloride",
        unit: "mEq/L",
        normalRange: "98-107",
        category: "Electrolytes",
      },
    ],
  },
  {
    id: "thyroid",
    name: "Thyroid Function Tests",
    icon: "🦋",
    parameters: [
      {
        id: "tsh",
        name: "TSH",
        unit: "μIU/mL",
        normalRange: "0.27-4.2",
        category: "Hormones",
      },
      {
        id: "t3",
        name: "T3",
        unit: "ng/dL",
        normalRange: "80-200",
        category: "Hormones",
      },
      {
        id: "t4",
        name: "T4",
        unit: "μg/dL",
        normalRange: "5.1-14.1",
        category: "Hormones",
      },
      {
        id: "free_t3",
        name: "Free T3",
        unit: "pg/mL",
        normalRange: "2.0-4.4",
        category: "Hormones",
      },
      {
        id: "free_t4",
        name: "Free T4",
        unit: "ng/dL",
        normalRange: "0.93-1.7",
        category: "Hormones",
      },
    ],
  },
  {
    id: "diabetes",
    name: "Diabetes Panel",
    icon: "🍯",
    parameters: [
      {
        id: "fasting_glucose",
        name: "Fasting Glucose",
        unit: "mg/dL",
        normalRange: "70-100",
        category: "Glucose",
      },
      {
        id: "random_glucose",
        name: "Random Glucose",
        unit: "mg/dL",
        normalRange: "70-140",
        category: "Glucose",
      },
      {
        id: "hba1c",
        name: "HbA1c",
        unit: "%",
        normalRange: "<5.7",
        category: "Glucose",
      },
      {
        id: "insulin",
        name: "Insulin",
        unit: "μU/mL",
        normalRange: "2.6-24.9",
        category: "Hormones",
      },
      {
        id: "c_peptide",
        name: "C-Peptide",
        unit: "ng/mL",
        normalRange: "1.1-4.4",
        category: "Hormones",
      },
    ],
  },
  {
    id: "cardiac",
    name: "Cardiac Markers",
    icon: "❤️",
    parameters: [
      {
        id: "troponin_i",
        name: "Troponin I",
        unit: "ng/mL",
        normalRange: "<0.04",
        category: "Cardiac",
      },
      {
        id: "troponin_t",
        name: "Troponin T",
        unit: "ng/mL",
        normalRange: "<0.01",
        category: "Cardiac",
      },
      {
        id: "ck_mb",
        name: "CK-MB",
        unit: "ng/mL",
        normalRange: "<6.3",
        category: "Cardiac",
      },
      {
        id: "ldh",
        name: "LDH",
        unit: "U/L",
        normalRange: "140-280",
        category: "Enzymes",
      },
      {
        id: "bnp",
        name: "BNP",
        unit: "pg/mL",
        normalRange: "<100",
        category: "Cardiac",
      },
    ],
  },
  {
    id: "vitamins",
    name: "Vitamins & Minerals",
    icon: "💊",
    parameters: [
      {
        id: "vitamin_d",
        name: "Vitamin D",
        unit: "ng/mL",
        normalRange: "30-100",
        category: "Vitamins",
      },
      {
        id: "vitamin_b12",
        name: "Vitamin B12",
        unit: "pg/mL",
        normalRange: "200-900",
        category: "Vitamins",
      },
      {
        id: "folate",
        name: "Folate",
        unit: "ng/mL",
        normalRange: "2.7-17.0",
        category: "Vitamins",
      },
      {
        id: "iron",
        name: "Iron",
        unit: "μg/dL",
        normalRange: "60-170",
        category: "Minerals",
      },
      {
        id: "ferritin",
        name: "Ferritin",
        unit: "ng/mL",
        normalRange: "12-300",
        category: "Minerals",
      },
      {
        id: "calcium",
        name: "Calcium",
        unit: "mg/dL",
        normalRange: "8.5-10.5",
        category: "Minerals",
      },
      {
        id: "magnesium",
        name: "Magnesium",
        unit: "mg/dL",
        normalRange: "1.7-2.2",
        category: "Minerals",
      },
    ],
  },
];

export default function LabTestEntry() {
  const [selectedTestGroup, setSelectedTestGroup] = useState<string>("");
  const [selectedParameters, setSelectedParameters] = useState<string[]>([]);
  const [testValues, setTestValues] = useState<Record<string, string>>({});
  const [testImages, setTestImages] = useState<Record<string, string>>({});
  const [testDescriptions, setTestDescriptions] = useState<
    Record<string, string>
  >({});
  const [testDate, setTestDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [savedTests, setSavedTests] = useState<SavedTest[]>([]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleParameterSelect = (parameterId: string, groupId: string) => {
    const parameterKey = `${groupId}_${parameterId}`;
    setSelectedParameters((prev) =>
      prev.includes(parameterKey)
        ? prev.filter((p) => p !== parameterKey)
        : [...prev, parameterKey]
    );
  };

  const handleValueChange = (
    parameterId: string,
    groupId: string,
    value: string
  ) => {
    const parameterKey = `${groupId}_${parameterId}`;
    setTestValues((prev) => ({
      ...prev,
      [parameterKey]: value,
    }));
  };

  const handleDescriptionChange = (
    parameterId: string,
    groupId: string,
    description: string
  ) => {
    const parameterKey = `${groupId}_${parameterId}`;
    setTestDescriptions((prev) => ({
      ...prev,
      [parameterKey]: description,
    }));
  };

  const handleImageUpload = (
    parameterId: string,
    groupId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const parameterKey = `${groupId}_${parameterId}`;
      const reader = new FileReader();
      reader.onload = (e) => {
        setTestImages((prev) => ({
          ...prev,
          [parameterKey]: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const selectAllGroupParameters = (groupId: string) => {
    const group = bloodTestGroups.find((g) => g.id === groupId);
    if (!group) return;

    const groupParameters = group.parameters.map((p) => `${groupId}_${p.id}`);

    const allSelected = groupParameters.every((p) =>
      selectedParameters.includes(p)
    );

    if (allSelected) {
      setSelectedParameters((prev) =>
        prev.filter((p) => !groupParameters.includes(p))
      );
    } else {
      setSelectedParameters((prev) => [
        ...new Set([...prev, ...groupParameters]),
      ]);
    }
  };

  const getParameterStatus = (
    value: string,
    normalRange: string
  ): "normal" | "high" | "low" | "pending" => {
    if (!value || !normalRange) return "pending";

    const numValue = Number.parseFloat(value);
    if (isNaN(numValue)) return "pending";

    // Simple range checking (can be enhanced)
    if (normalRange.includes("<")) {
      const maxValue = Number.parseFloat(normalRange.replace("<", ""));
      return numValue <= maxValue ? "normal" : "high";
    } else if (normalRange.includes(">")) {
      const minValue = Number.parseFloat(normalRange.replace(">", ""));
      return numValue >= minValue ? "normal" : "low";
    } else if (normalRange.includes("-")) {
      const [min, max] = normalRange
        .split("-")
        .map((v) => Number.parseFloat(v));
      return numValue >= min && numValue <= max
        ? "normal"
        : numValue < min
        ? "low"
        : "high";
    }

    return "pending";
  };

  const saveSelectedTests = () => {
    const testsToSave: SavedTest[] = selectedParameters
      .map((paramKey) => {
        const [groupId, parameterId] = paramKey.split("_");
        const group = bloodTestGroups.find((g) => g.id === groupId);
        if (!group) return null;

        const parameter = group.parameters.find((p) => p.id === parameterId);
        if (!parameter) return null;

        return {
          id: paramKey,
          groupName: group.name,
          parameterName: parameter.name,
          value: testValues[paramKey] || "",
          unit: parameter.unit,
          normalRange: parameter.normalRange,
          status: getParameterStatus(
            testValues[paramKey],
            parameter.normalRange
          ),
          description: testDescriptions[paramKey] || "",
          image: testImages[paramKey] || null,
          date: testDate,
          timestamp: new Date().toISOString(),
        };
      })
      .filter((test): test is SavedTest => test !== null && test.value !== ""); // Only save tests with values

    setSavedTests((prev) => [...prev, ...testsToSave]);

    // Clear selections and values
    setSelectedParameters([]);
    setTestValues({});
    setTestDescriptions({});
    setTestImages({});

    alert(`Saved ${testsToSave.length} test results successfully!`);
  };

  const groupParametersByCategory = (parameters: BloodTestParameter[]) => {
    return parameters.reduce(
      (acc: Record<string, BloodTestParameter[]>, param) => {
        const category = param.category || "Other";
        if (!acc[category]) acc[category] = [];
        acc[category].push(param);
        return acc;
      },
      {}
    );
  };

  return (
    <div className="flex h-[calc(100vh-200px)] gap-6">
      {/* Left Sidebar - Test Groups */}
      <div className="w-80 bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Blood Test Groups</h3>
          <p className="text-sm text-gray-600">
            Select parameters to enter values
          </p>
        </div>

        <ScrollArea className="h-[calc(100%-80px)]">
          <div className="p-4 space-y-2">
            {bloodTestGroups.map((group) => (
              <Collapsible
                key={group.id}
                open={openGroups[group.id] || false}
                onOpenChange={() => toggleGroup(group.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-3 h-auto"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{group.icon}</span>
                      <div className="text-left">
                        <p className="font-medium">{group.name}</p>
                        <p className="text-xs text-gray-500">
                          {group.parameters.length} parameters
                        </p>
                      </div>
                    </div>
                    {openGroups[group.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="space-y-2 mt-2">
                  <div className="ml-4 mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectAllGroupParameters(group.id)}
                      className="text-xs"
                    >
                      {group.parameters.every((p) =>
                        selectedParameters.includes(`${group.id}_${p.id}`)
                      )
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  </div>

                  {Object.entries(
                    groupParametersByCategory(group.parameters)
                  ).map(([category, params]) => (
                    <div key={category} className="ml-4">
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        {category}
                      </p>
                      {params.map((parameter) => {
                        const parameterKey = `${group.id}_${parameter.id}`;
                        const isSelected =
                          selectedParameters.includes(parameterKey);
                        const hasValue = testValues[parameterKey];

                        return (
                          <div
                            key={parameter.id}
                            className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-blue-50 border-blue-200"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() =>
                              handleParameterSelect(parameter.id, group.id)
                            }
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() =>
                                handleParameterSelect(parameter.id, group.id)
                              }
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {parameter.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {parameter.normalRange} {parameter.unit}
                              </p>
                            </div>
                            {hasValue && (
                              <div className="flex items-center gap-1">
                                <Check className="h-3 w-3 text-green-600" />
                                <Badge
                                  variant={
                                    getParameterStatus(
                                      testValues[parameterKey],
                                      parameter.normalRange
                                    ) === "normal"
                                      ? "default"
                                      : "destructive"
                                  }
                                  className="text-xs"
                                >
                                  {testValues[parameterKey]} {parameter.unit}
                                </Badge>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Side - Parameter Entry */}
      <div className="flex-1 space-y-6">
        {/* Test Date and Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Lab Test Entry
                </CardTitle>
                <CardDescription>
                  Selected {selectedParameters.length} parameters for entry
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <Input
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                <Button
                  onClick={saveSelectedTests}
                  disabled={
                    selectedParameters.length === 0 ||
                    !Object.keys(testValues).some((key) => testValues[key])
                  }
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Tests (
                  {
                    Object.keys(testValues).filter((key) => testValues[key])
                      .length
                  }
                  )
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Parameter Entry Forms */}
        <ScrollArea className="h-[calc(100vh-350px)]">
          <div className="space-y-4">
            {selectedParameters.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-40">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Select parameters from the left sidebar to start entering
                      values
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              selectedParameters
                .map((parameterKey) => {
                  const [groupId, parameterId] = parameterKey.split("_");
                  const group = bloodTestGroups.find((g) => g.id === groupId);
                  if (!group) return null;

                  const parameter = group.parameters.find(
                    (p) => p.id === parameterId
                  );
                  if (!parameter) return null;

                  const status = getParameterStatus(
                    testValues[parameterKey],
                    parameter.normalRange
                  );

                  return (
                    <Card key={parameterKey}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <span>{group.icon}</span>
                              {parameter.name}
                            </CardTitle>
                            <CardDescription>
                              {group.name} • Normal Range:{" "}
                              {parameter.normalRange} {parameter.unit}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              status === "normal"
                                ? "default"
                                : status === "high" || status === "low"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {status === "normal"
                              ? "Normal"
                              : status === "high"
                              ? "High"
                              : status === "low"
                              ? "Low"
                              : "Pending"}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Value Input */}
                          <div>
                            <Label htmlFor={`value-${parameterKey}`}>
                              Test Value <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id={`value-${parameterKey}`}
                                type="number"
                                step="0.01"
                                placeholder="Enter value"
                                value={testValues[parameterKey] || ""}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  handleValueChange(
                                    parameterId,
                                    groupId,
                                    e.target.value
                                  )
                                }
                                className="flex-1"
                              />
                              <div className="flex items-center px-3 bg-gray-100 rounded border text-sm text-gray-600">
                                {parameter.unit}
                              </div>
                            </div>
                          </div>

                          {/* Image Upload */}
                          <div>
                            <Label htmlFor={`image-${parameterKey}`}>
                              Test Report Image
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id={`image-${parameterKey}`}
                                type="file"
                                accept="image/*"
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => handleImageUpload(parameterId, groupId, e)}
                                className="flex-1"
                              />
                              {testImages[parameterKey] && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <ImageIcon className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>
                                        {parameter.name} - Test Report
                                      </DialogTitle>
                                    </DialogHeader>
                                    <img
                                      src={
                                        testImages[parameterKey] ||
                                        "/placeholder.svg"
                                      }
                                      alt="Test Report"
                                      className="w-full h-auto rounded-lg"
                                    />
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <Label htmlFor={`description-${parameterKey}`}>
                            Notes & Description
                          </Label>
                          <Textarea
                            id={`description-${parameterKey}`}
                            placeholder="Add any notes, observations, or additional information..."
                            value={testDescriptions[parameterKey] || ""}
                            onChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>
                            ) =>
                              handleDescriptionChange(
                                parameterId,
                                groupId,
                                e.target.value
                              )
                            }
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
                .filter(Boolean) // Filter out null values
            )}
          </div>
        </ScrollArea>

        {/* Recently Saved Tests */}
        {savedTests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recently Saved Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {savedTests
                  .slice(-5)
                  .reverse()
                  .map((test, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {test.parameterName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {test.groupName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {test.value} {test.unit}
                        </p>
                        <Badge
                          variant={
                            test.status === "normal" ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {test.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

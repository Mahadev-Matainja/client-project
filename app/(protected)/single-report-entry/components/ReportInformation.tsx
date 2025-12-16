"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { postEntry, testparameter } from "@/services/TestsService";
import React, { useEffect, useState } from "react";
import {
  FileText,
  Trash2,
  ImageIcon,
  Loader2,
  CalendarIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

import { toast } from "@/hooks/use-toast";
import SuccessMessage from "./SuccessMessage";

interface Parameter {
  id: number;
  testgroup_id: number;
  name: string;
  key: string;
  priyority: number;
  type_of_input: string;
  unit: string;
  start_range: string;
  end_range: string;
  method: string | null;
  group_name: string;
  is_applicable: boolean;
}

interface ReportInformationProps {
  groupId: number | null;
  parameterId: number | null;
  testId: number | null;
  onResetParameter?: () => void;
}

interface ParameterForm {
  value: string;
  description: string;
  image: File | null;
}

const ReportInformation: React.FC<ReportInformationProps> = ({
  groupId,
  parameterId,
  testId,

  onResetParameter,
}) => {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState(false);
  // Report-level fields
  const [testDate, setTestDate] = useState<Date | null>(new Date());
  const [labName, setLabName] = useState("");
  const [doctorName, setDoctorName] = useState("");

  // Parameter-specific states
  const [parameterForms, setParameterForms] = useState<
    Record<number, ParameterForm>
  >({});
  const [initialForms, setInitialForms] = useState<
    Record<number, ParameterForm>
  >({});
  const [initialReportInfo, setInitialReportInfo] = useState({
    testDate: "",
    labName: "",
    doctorName: "",
  });
  const [prescriptionImage, setPrescriptionImage] = useState<File | null>(null);

  // Load parameters
  useEffect(() => {
    const loadParameters = async () => {
      if (!groupId) return;
      setLoading(true);
      try {
        const res = await testparameter(groupId);
        let paramList: Parameter[] = [];
        if (parameterId) {
          paramList = res.data.filter(
            (param: Parameter) => param.id === parameterId
          );
        } else {
          paramList = res.data || [];
        }

        setParameters(paramList);

        // Initialize parameterForms if not already set
        const initForms: Record<number, ParameterForm> = {};
        paramList.forEach((param) => {
          initForms[param.id] = { value: "", description: "", image: null };
        });
        setParameterForms(initForms);
        setInitialForms(initForms);

        // Store initial report info
        setInitialReportInfo({
          testDate: testDate ? format(testDate, "yyyy-MM-dd") : "",
          labName,
          doctorName,
        });
      } catch (error) {
        console.error("Failed to fetch parameters:", error);
      } finally {
        setLoading(false);
      }
    };

    loadParameters();
  }, [groupId, parameterId]);

  // Get status for badge
  const getStatus = (parameter: Parameter) => {
    const paramForm = parameterForms[parameter.id];
    if (!paramForm || !paramForm.value) return "pending";
    const value = parseFloat(paramForm.value);
    if (parameter.start_range && parameter.end_range) {
      const start = parseFloat(parameter.start_range);
      const end = parseFloat(parameter.end_range);
      if (value < start) return "low";
      if (value > end) return "high";
      return "normal";
    }
    return "pending";
  };

  // Update parameter form
  const handleFormChange = (
    paramId: number,
    field: keyof ParameterForm,
    value: any
  ) => {
    setParameterForms((prev) => ({
      ...prev,
      [paramId]: { ...prev[paramId], [field]: value },
    }));
  };

  // prescription upload

  const handlePrescriptionUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) setPrescriptionImage(file);
  };

  // Remove parameter card
  const handleRemoveCard = (paramId: number) => {
    setParameters((prev) => prev.filter((param) => param.id !== paramId));
    setParameterForms((prev) => {
      const updated = { ...prev };
      delete updated[paramId];
      return updated;
    });
  };

  // Save
  const handleSave = async () => {
    try {
      setLoading(true);

      // Create FormData
      const formData = new FormData();
      formData.append(
        "date_of_test",
        testDate ? format(testDate, "dd.MM.yyyy") : ""
      );
      formData.append("lab_name", labName);
      formData.append("doctor_name", doctorName);
      if (prescriptionImage) {
        formData.append("prescription", prescriptionImage);
      }

      parameters.forEach((param, index) => {
        const form = parameterForms[param.id];
        formData.append(`tests[${index}][test_id]`, String(testId));
        formData.append(
          `tests[${index}][group_id]`,
          String(param.testgroup_id)
        );
        formData.append(`tests[${index}][parameter_id]`, String(param.id));
        formData.append(`tests[${index}][test_value]`, form.value || "");
        formData.append(`tests[${index}][prescription]`, "");
        formData.append(`tests[${index}][description]`, form.description || "");
        formData.append(`tests[${index}][remark]`, "");
        if (form.image) {
          formData.append(`tests[${index}][test_report]`, form.image);
        }
      });

      const response = await postEntry(formData);

      if (response.status === 201) {
        setStatusCode(true);
        setTimeout(() => {
          setStatusCode(false);
          setTestDate(new Date());
          setLabName("");
          setDoctorName("");
          setParameterForms({});
          if (onResetParameter) {
            onResetParameter(); // callback from parent
          }
        }, 3000);
      }
    } catch (error: any) {
      console.error("Error saving entry:", error);
      const errors = error?.response?.data?.errors;
      const message = errors
        ? Object.values(errors).flat().join(" | ")
        : error?.response?.data?.message || "Failed to save entry.";

      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {statusCode ? (
        <SuccessMessage />
      ) : (
        <>
          {/* Report Info */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Report Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="testDate" className="mb-2">
                    Report Date <span className="text-red-500">*</span>
                  </Label>

                  <div className="">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {testDate ? (
                            format(testDate, "dd/MM/yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={testDate || undefined}
                          onSelect={(e) => setTestDate(e || null)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div>
                  <Label htmlFor="labName" className="mb-2">
                    Lab Name
                  </Label>
                  <Input
                    id="labName"
                    placeholder="Enter lab name"
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="doctorName" className="mb-2">
                    Doctor Name
                  </Label>
                  <Input
                    id="doctorName"
                    placeholder="Enter doctor name"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                  />
                </div>
              </div>

              {/* prescription Upload */}
              <div className="w-1/2 mt-4">
                <Label htmlFor="prescriptionUpload">Prescription Upload</Label>
                <div className="flex gap-2 mt-2 items-center">
                  <Input
                    id="prescriptionUpload"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handlePrescriptionUpload}
                    className="flex-1"
                  />
                  {prescriptionImage && (
                    <div className="flex items-center gap-2">
                      {/* Preview Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Prescription Report</DialogTitle>
                          </DialogHeader>

                          {prescriptionImage.type === "application/pdf" ? (
                            <iframe
                              src={URL.createObjectURL(prescriptionImage)}
                              className="w-full h-[600px] rounded-lg"
                            />
                          ) : (
                            <img
                              src={URL.createObjectURL(prescriptionImage)}
                              alt="Prescription"
                              className="w-full h-auto rounded-lg"
                            />
                          )}
                        </DialogContent>
                      </Dialog>

                      {/* Remove Icon */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPrescriptionImage(null);
                          const input = document.getElementById(
                            "prescriptionUpload"
                          ) as HTMLInputElement | null;
                          if (input) input.value = "";
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Parameters
              </CardTitle>
              <CardDescription>
                Enter values for selected report parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <ScrollArea className="h-[400px]">
                  {parameters.map((parameter) => {
                    const paramForm = parameterForms[parameter.id] || {
                      value: "",
                      description: "",
                      image: null,
                    };
                    const status = getStatus(parameter);

                    return (
                      <Card
                        key={parameter.id}
                        className="border-l-4 border-l-blue-500 mb-4"
                      >
                        <CardHeader className="pb-3 flex justify-between items-center">
                          <div>
                            <CardTitle className="text-lg">
                              {parameter.name}
                            </CardTitle>

                            <CardDescription>
                              {parameter.group_name}
                              {parameter.is_applicable && (
                                <>
                                  • Normal: {parameter.start_range} -{" "}
                                  {parameter.end_range} {parameter.unit}
                                </>
                              )}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveCard(parameter.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Report Value */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {parameter.is_applicable === false ? null : (
                              <div>
                                <Label>
                                  Report Value
                                  <span className="text-red-500">*</span>
                                </Label>
                                <div className="flex gap-2 mt-2">
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Enter value"
                                    value={paramForm.value}
                                    onChange={(e) =>
                                      handleFormChange(
                                        parameter.id,
                                        "value",
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
                            )}

                            {/* Test Report Upload */}
                            <div>
                              <Label htmlFor={`file-${parameter.id}`}>
                                Test Report
                              </Label>
                              <div className="flex gap-2 mt-2 items-center">
                                <Input
                                  id={`file-${parameter.id}`}
                                  type="file"
                                  accept="image/*,application/pdf"
                                  onChange={(e) =>
                                    e.target.files &&
                                    handleFormChange(
                                      parameter.id,
                                      "image",
                                      e.target.files[0]
                                    )
                                  }
                                  className="flex-1"
                                />

                                {paramForm.image && (
                                  <div className="flex items-center gap-2">
                                    {/* Preview */}
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

                                        {paramForm.image.type ===
                                        "application/pdf" ? (
                                          <iframe
                                            src={URL.createObjectURL(
                                              paramForm.image
                                            )}
                                            className="w-full h-[600px] rounded-lg"
                                          />
                                        ) : (
                                          <img
                                            src={URL.createObjectURL(
                                              paramForm.image
                                            )}
                                            alt="Test Report"
                                            className="w-full h-auto rounded-lg"
                                          />
                                        )}
                                      </DialogContent>
                                    </Dialog>

                                    {/* Remove file */}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        handleFormChange(
                                          parameter.id,
                                          "image",
                                          null
                                        );
                                        const input = document.getElementById(
                                          `file-${parameter.id}`
                                        ) as HTMLInputElement | null;
                                        if (input) input.value = "";
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          <div>
                            <Label>Notes & Description</Label>
                            <Textarea
                              className="mt-2"
                              placeholder="Add any notes or observations..."
                              value={paramForm.description}
                              onChange={(e) =>
                                handleFormChange(
                                  parameter.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={2}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}

          <div className="flex justify-end mr-4">
            <Button
              variant="secondary"
              className="text-white bg-blue-700 hover:bg-blue-800 flex items-center gap-2 cursor-pointer"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default ReportInformation;

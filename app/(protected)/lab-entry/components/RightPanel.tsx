"use client";
import React, { useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, ImageIcon, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SelectedTestItem } from "./TestEntry";
import { postEntry } from "@/services/TestsService";
import { toast } from "@/hooks/use-toast";
import SuccessMessage from "./SuccessMessage";

type Props = {
  selectedTests: SelectedTestItem[];
  onRemoveTest: (key: string) => void;
  selectedTestId: number | null;
  onResetTests: () => void;
};

const RightPanel: React.FC<Props> = ({
  selectedTests,
  onRemoveTest,
  selectedTestId,
  onResetTests,
}) => {
  // local UI states
  const [testDate, setTestDate] = useState<Date | null>(new Date());
  const [labName, setLabName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [testValues, setTestValues] = useState<Record<string, string>>({});
  const [testImages, setTestImages] = useState<Record<string, File>>({});
  const [statusCode, setStatusCode] = useState(false);
  const [testDescriptions, setTestDescriptions] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState<boolean>(false);

  const [prescriptionImage, setPrescriptionImage] = useState<File | null>(null);

  const getParameterStatus = (value?: string, normalRange?: string) => {
    if (!value) return "pending";
    const num = parseFloat(value);
    if (isNaN(num)) return "pending";
    if (!normalRange) return "pending";
    const [min, max] = normalRange.split("-").map(Number);
    if (num < min) return "low";
    if (num > max) return "high";
    return "normal";
  };

  const handleValueChange = (key: string, value: string) =>
    setTestValues((prev) => ({ ...prev, [key]: value }));

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setTestImages((prev) => ({
        ...prev,
        [key]: file,
      }));
    }
  };

  const handlePrescriptionUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) setPrescriptionImage(file);
  };

  const handleDescriptionChange = (key: string, value: string) =>
    setTestDescriptions((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    try {
      setLoading(true);
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

      selectedTests.forEach((test, index) => {
        const value = testValues[test.key] || "";
        const remark = getParameterStatus(value, test.normalRange || "");

        formData.append(`tests[${index}][test_id]`, String(selectedTestId));
        formData.append(`tests[${index}][group_id]`, String(test.groupId));
        formData.append(
          `tests[${index}][parameter_id]`,
          String(parseInt(test.key.split("_")[1]))
        );
        formData.append(`tests[${index}][test_value]`, value);

        if (testImages[test.key]) {
          formData.append(`tests[${index}][test_report]`, testImages[test.key]);
        }

        formData.append(
          `tests[${index}][description]`,
          testDescriptions[test.key] || ""
        );
        formData.append(`tests[${index}][remark]`, remark);
      });

      const response = await postEntry(formData);

      if (response.status === 201) {
        setStatusCode(true);
        setTimeout(() => {
          setStatusCode(false);
          setTestDate(new Date());
          setLabName("");
          setDoctorName("");
          setTestValues({});
          setTestImages({});
          setTestDescriptions({});
          onResetTests();
        }, 3000);
      }
    } catch (error: any) {
      console.error("Error saving entry:", error);
      const errors = error?.response?.data?.errors;
      const message = errors
        ? Object.values(errors).flat().join(" | ")
        : error?.response?.data?.message || "Failed to save entry.";

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      {statusCode === false ? (
        <>
          {/* Test Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Test Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="testDate" className="mb-2">
                    Test Date<span className="text-red-500">*</span>
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
              {/* prescription upload */}

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

          {/* Selected Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Selected Tests ({selectedTests.length})
              </CardTitle>
              <CardDescription>
                Enter values for selected test parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTests.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No tests selected. Choose tests from the left panel.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {selectedTests.map((test) => {
                      const status = getParameterStatus(
                        testValues[test.key],
                        test.normalRange
                      );
                      return (
                        <Card
                          key={test.key}
                          className="border-l-4 border-l-blue-500"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">
                                  {test.testName}
                                </CardTitle>

                                <CardDescription>
                                  {test.groupName}
                                  {test.is_applicable && (
                                    <>
                                      • Normal: {test.normalRange} {test.unit}
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
                                  onClick={() => onRemoveTest(test.key)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div
                              className={`grid gap-4 ${
                                !test.is_applicable
                                  ? "grid-cols-1"
                                  : "grid-cols-1 md:grid-cols-2"
                              }`}
                            >
                              {test.is_applicable && (
                                <div>
                                  <Label htmlFor={`value-${test.key}`}>
                                    Test Value{" "}
                                    <span className="text-red-500">*</span>
                                  </Label>
                                  <div className="flex gap-2 mt-2">
                                    <Input
                                      id={`value-${test.key}`}
                                      type="number"
                                      step="0.01"
                                      placeholder="Enter value"
                                      value={testValues[test.key] || ""}
                                      onChange={(e) =>
                                        handleValueChange(
                                          test.key,
                                          e.target.value
                                        )
                                      }
                                      className="flex-1"
                                    />
                                    <div className="flex items-center px-3 bg-gray-100 rounded border text-sm text-gray-600">
                                      {test.unit}
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div>
                                <Label htmlFor={`file-${test.key}`}>
                                  Test Report
                                  {test.is_applicable && (
                                    <span className="text-red-500">*</span>
                                  )}
                                </Label>
                                <div className="flex gap-2 mt-2 items-center">
                                  <Input
                                    id={`file-${test.key}`}
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={(e) =>
                                      handleImageUpload(e, test.key)
                                    }
                                    className="flex-1"
                                  />

                                  {testImages[test.key] && (
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
                                            <DialogTitle>
                                              {test.testName} - Test Report
                                            </DialogTitle>
                                          </DialogHeader>

                                          {testImages[test.key].type ===
                                          "application/pdf" ? (
                                            <iframe
                                              src={URL.createObjectURL(
                                                testImages[test.key]
                                              )}
                                              className="w-full h-[600px] rounded-lg"
                                            />
                                          ) : (
                                            <img
                                              src={URL.createObjectURL(
                                                testImages[test.key]
                                              )}
                                              alt="Test Report"
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
                                          setTestImages((prev) => {
                                            const updated = { ...prev };
                                            delete updated[test.key];
                                            return updated;
                                          });

                                          // reset input field value too
                                          const input = document.getElementById(
                                            `file-${test.key}`
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
                            <div>
                              <Label htmlFor={`description-${test.key}`}>
                                Notes & Description
                              </Label>
                              <Textarea
                                className="mt-2"
                                id={`description-${test.key}`}
                                placeholder="Add any notes or observations..."
                                value={testDescriptions[test.key] || ""}
                                onChange={(e) =>
                                  handleDescriptionChange(
                                    test.key,
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
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Save Button with Loader */}
          <div className="flex justify-end mr-4">
            <Button
              variant="secondary"
              className="text-white bg-blue-700 hover:bg-blue-800 flex items-center gap-2 cursor-pointer"
              onClick={handleSave}
              disabled={loading || selectedTests.length === 0}
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
      ) : (
        <SuccessMessage />
      )}
    </div>
  );
};

export default RightPanel;

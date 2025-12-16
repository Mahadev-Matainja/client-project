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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  Save,
  FileText,
  ImageIcon,
  Clock,
  Trash2,
  Eye,
  CheckCircle2,
  ArrowLeft,
  User,
  Bell,
  LogOut,
  Menu,
  Calendar,
  History,
  Upload,
  Download,
  Settings,
  HelpCircle,
  Search,
  Filter,
  BarChart3,
} from "lucide-react";

// Type definitions
interface TestParameter {
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
  parameters: TestParameter[];
}

interface SelectedTest {
  key: string;
  groupId: string;
  groupName: string;
  testId: string;
  testName: string;
  unit: string;
  normalRange: string;
  category: string;
}

interface LabTestEntryPageProps {
  onSaveTests?: (tests: any[]) => void;
  onNavigateToRecords?: () => void;
  onNavigateBack?: () => void;
}

type ParameterStatus = "pending" | "normal" | "high" | "low";
type ActiveSection = "entry" | "history" | "analytics";

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
        id: "platelets",
        name: "Platelets",
        unit: "K/μL",
        normalRange: "150-450",
        category: "Platelets",
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
        id: "total_bilirubin",
        name: "Total Bilirubin",
        unit: "mg/dL",
        normalRange: "0.3-1.2",
        category: "Bilirubin",
      },
      {
        id: "albumin",
        name: "Albumin",
        unit: "g/dL",
        normalRange: "3.5-5.0",
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
    ],
  },
];

export default function LabTestEntryPage({
  onSaveTests,
  onNavigateToRecords,
  onNavigateBack,
}: LabTestEntryPageProps) {
  const [selectedTests, setSelectedTests] = useState<SelectedTest[]>([]);
  const [testValues, setTestValues] = useState<Record<string, string>>({});
  const [testImages, setTestImages] = useState<Record<string, string>>({});
  const [testDescriptions, setTestDescriptions] = useState<
    Record<string, string>
  >({});
  const [testDate, setTestDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [labName, setLabName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>("entry");

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleTestSelect = (
    test: TestParameter,
    groupId: string,
    groupName: string
  ) => {
    const testKey = `${groupId}_${test.id}`;
    const testData: SelectedTest = {
      key: testKey,
      groupId,
      groupName,
      testId: test.id,
      testName: test.name,
      unit: test.unit,
      normalRange: test.normalRange,
      category: test.category,
    };

    setSelectedTests((prev) => {
      const exists = prev.find((t) => t.key === testKey);
      if (exists) {
        return prev.filter((t) => t.key !== testKey);
      } else {
        return [...prev, testData];
      }
    });
  };

  const handleValueChange = (testKey: string, value: string) => {
    setTestValues((prev) => ({
      ...prev,
      [testKey]: value,
    }));
  };

  const handleDescriptionChange = (testKey: string, description: string) => {
    setTestDescriptions((prev) => ({
      ...prev,
      [testKey]: description,
    }));
  };

  const handleImageUpload = (
    testKey: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTestImages((prev) => ({
          ...prev,
          [testKey]: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedTest = (testKey: string) => {
    setSelectedTests((prev) => prev.filter((t) => t.key !== testKey));
    setTestValues((prev) => {
      const newValues = { ...prev };
      delete newValues[testKey];
      return newValues;
    });
    setTestDescriptions((prev) => {
      const newDesc = { ...prev };
      delete newDesc[testKey];
      return newDesc;
    });
    setTestImages((prev) => {
      const newImages = { ...prev };
      delete newImages[testKey];
      return newImages;
    });
  };

  const getParameterStatus = (
    value: string,
    normalRange: string
  ): ParameterStatus => {
    if (!value || !normalRange) return "pending";

    const numValue = Number.parseFloat(value);
    if (isNaN(numValue)) return "pending";

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

  const handleSaveTests = async () => {
    setIsSaving(true);

    const testsToSave = selectedTests
      .filter((test) => testValues[test.key]) // Only save tests with values
      .map((test) => ({
        id: `${Date.now()}_${test.key}`,
        ...test,
        value: testValues[test.key],
        status: getParameterStatus(testValues[test.key], test.normalRange),
        description: testDescriptions[test.key] || "",
        image: testImages[test.key] || null,
        date: testDate,
        labName: labName || "Not specified",
        doctorName: doctorName || "Not specified",
        timestamp: new Date().toISOString(),
      }));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (onSaveTests) {
      onSaveTests(testsToSave);
    }

    // Clear selections and values
    setSelectedTests([]);
    setTestValues({});
    setTestDescriptions({});
    setTestImages({});
    setLabName("");
    setDoctorName("");

    setIsSaving(false);
    setSaveSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const selectAllGroupTests = (groupId: string) => {
    const group = bloodTestGroups.find((g) => g.id === groupId);
    if (!group) return;

    const groupTests: SelectedTest[] = group.parameters.map((param) => ({
      key: `${groupId}_${param.id}`,
      groupId,
      groupName: group.name,
      testId: param.id,
      testName: param.name,
      unit: param.unit,
      normalRange: param.normalRange,
      category: param.category,
    }));

    const allSelected = groupTests.every((test) =>
      selectedTests.some((selected) => selected.key === test.key)
    );

    if (allSelected) {
      // Remove all group tests
      setSelectedTests((prev) =>
        prev.filter(
          (test) => !groupTests.some((groupTest) => groupTest.key === test.key)
        )
      );
    } else {
      // Add all group tests
      setSelectedTests((prev) => {
        const newTests = [...prev];
        groupTests.forEach((test) => {
          if (!newTests.some((existing) => existing.key === test.key)) {
            newTests.push(test);
          }
        });
        return newTests;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Back Button */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onNavigateBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden md:inline">Back to Dashboard</span>
              </Button>
              <div className="flex items-center gap-3">
                <img src="/predikr.svg" alt="Care Logo" className="w-12" />
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Lab Test Entry
                  </h1>
                  <p className="text-xs text-gray-500">
                    Comprehensive Test Management
                  </p>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search tests..." className="pl-10 w-64" />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
              </Button>

              {/* Quick Actions */}
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
                onClick={onNavigateToRecords}
              >
                <Eye className="h-4 w-4" />
                <span className="hidden md:inline">View Records</span>
              </Button>

              <Button
                onClick={handleSaveTests}
                disabled={
                  selectedTests.length === 0 ||
                  !Object.keys(testValues).some((key) => testValues[key]) ||
                  isSaving
                }
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save (
                    {
                      Object.keys(testValues).filter((key) => testValues[key])
                        .length
                    }
                    )
                  </>
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-gray-500">Lab Technician</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Lab Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onNavigateToRecords}>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>View Records</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Search className="mr-2 h-4 w-4" />
                    <span>Search Tests</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-8">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">John Doe</h3>
                <p className="text-sm text-gray-500">Lab Technician</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <Button
                variant={activeSection === "entry" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection("entry")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Test Entry
              </Button>
              <Button
                variant={activeSection === "history" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection("history")}
              >
                <History className="mr-2 h-4 w-4" />
                Recent Tests
              </Button>
              <Button
                variant={activeSection === "analytics" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection("analytics")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={onNavigateToRecords}
              >
                <Eye className="mr-2 h-4 w-4" />
                View All Records
              </Button>
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 space-y-2">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Quick Actions
              </h4>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 bg-transparent"
              >
                <Upload className="h-4 w-4" />
                Import Results
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 bg-transparent"
              >
                <Calendar className="h-4 w-4" />
                Schedule Tests
              </Button>
            </div>

            {/* Test Statistics */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                Today's Progress
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600">Tests Entered</span>
                  <span className="font-semibold text-blue-800">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600">Pending Review</span>
                  <span className="font-semibold text-blue-800">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600">Completed</span>
                  <span className="font-semibold text-blue-800">9</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Success Message */}
          {saveSuccess && (
            <Card className="border-green-200 bg-green-50 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Tests saved successfully!</span>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "entry" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Panel - Test Selection */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Select Tests
                    </CardTitle>
                    <CardDescription>
                      Choose test parameters to enter values
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-3">
                        {bloodTestGroups.map((group) => (
                          <Collapsible
                            key={group.id}
                            open={openGroups[group.id]}
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
                                      {group.parameters.length} tests
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
                                  onClick={() => selectAllGroupTests(group.id)}
                                  className="text-xs"
                                >
                                  {group.parameters.every((param) =>
                                    selectedTests.some(
                                      (test) =>
                                        test.key === `${group.id}_${param.id}`
                                    )
                                  )
                                    ? "Deselect All"
                                    : "Select All"}
                                </Button>
                              </div>

                              {group.parameters.map((parameter) => {
                                const testKey = `${group.id}_${parameter.id}`;
                                const isSelected = selectedTests.some(
                                  (test) => test.key === testKey
                                );

                                return (
                                  <div
                                    key={parameter.id}
                                    className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors ml-4 ${
                                      isSelected
                                        ? "bg-blue-50 border-blue-200"
                                        : "hover:bg-gray-50"
                                    }`}
                                    onClick={() =>
                                      handleTestSelect(
                                        parameter,
                                        group.id,
                                        group.name
                                      )
                                    }
                                  >
                                    <Checkbox checked={isSelected} />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">
                                        {parameter.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {parameter.normalRange} {parameter.unit}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Test Entry */}
              <div className="lg:col-span-2 space-y-6">
                {/* Test Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Test Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="testDate">Test Date</Label>
                        <Input
                          id="testDate"
                          type="date"
                          value={testDate}
                          onChange={(e) => setTestDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="labName">Lab Name</Label>
                        <Input
                          id="labName"
                          placeholder="Enter lab name"
                          value={labName}
                          onChange={(e) => setLabName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="doctorName">Doctor Name</Label>
                        <Input
                          id="doctorName"
                          placeholder="Enter doctor name"
                          value={doctorName}
                          onChange={(e) => setDoctorName(e.target.value)}
                        />
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
                                        {test.groupName} • Normal:{" "}
                                        {test.normalRange} {test.unit}
                                      </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant={
                                          status === "normal"
                                            ? "default"
                                            : status === "high" ||
                                              status === "low"
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
                                        onClick={() =>
                                          removeSelectedTest(test.key)
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor={`value-${test.key}`}>
                                        Test Value{" "}
                                        <span className="text-red-500">*</span>
                                      </Label>
                                      <div className="flex gap-2">
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

                                    <div>
                                      <Label htmlFor={`image-${test.key}`}>
                                        Test Report Image
                                      </Label>
                                      <div className="flex gap-2">
                                        <Input
                                          id={`image-${test.key}`}
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) =>
                                            handleImageUpload(test.key, e)
                                          }
                                          className="flex-1"
                                        />
                                        {testImages[test.key] && (
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                              >
                                                <ImageIcon className="h-4 w-4" />
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                              <DialogHeader>
                                                <DialogTitle>
                                                  {test.testName} - Test Report
                                                </DialogTitle>
                                              </DialogHeader>
                                              <img
                                                src={
                                                  testImages[test.key] ||
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

                                  <div>
                                    <Label htmlFor={`description-${test.key}`}>
                                      Notes & Description
                                    </Label>
                                    <Textarea
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
              </div>
            </div>
          )}

          {activeSection === "history" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Test Entries
                </CardTitle>
                <CardDescription>
                  Your recently entered test results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent test entries found.</p>
                  <Button
                    className="mt-4"
                    onClick={() => setActiveSection("entry")}
                  >
                    Start Entering Tests
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "analytics" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Test Analytics
                </CardTitle>
                <CardDescription>
                  Analytics and insights from your test data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Analytics will be available once you have entered test data.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setActiveSection("entry")}
                  >
                    Enter Test Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

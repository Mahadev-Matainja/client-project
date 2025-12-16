"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  TrendingUp,
  Crown,
  House,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { fetchTests, selectTest } from "@/services/TestsService";
import TestEntry from "./components/TestEntry";
import MainLayout from "@/components/layout/main-layout";

// Define types
interface TestParameter {
  id: string;
  name: string;
  unit: string;
  normalRange: string;
  category?: string;
  measurement_unit?: string;
  start_range?: number | string;
  end_range?: number | string;
}

interface TestGroup {
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
  normalRange: string | null;
  category: string;
  id?: number | string;
  group_id?: string;
}

interface TestValue {
  [key: string]: string;
}

interface TestImage {
  [key: string]: string;
}

interface TestDescription {
  [key: string]: string;
}

interface OpenGroups {
  [key: string]: boolean;
}

interface NavItem {
  path: string;
  label: string;
  icon: any; // Using any for Lucide icons
  section: string;
}

interface ProfileData {
  name: string;
  email: string;
  role: string;
}

interface ApiTest {
  id: number;
  name: string;
  priyority: number;
  // Add other properties as needed
}

interface SelectedApiTest {
  id: number;
  name: string;
  priyority: number;
  // Add other properties as needed
}

const bloodTestGroups: TestGroup[] = [
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

const navItems: NavItem[] = [
  {
    path: "/lab-entry",
    label: "Report Entry",
    icon: FileText,
    section: "entry",
  },
  {
    path: "/test-records",
    label: "Report Records",
    icon: FileText,
    section: "history",
  },
  {
    path: "/analytics",
    label: "Analytics",
    icon: TrendingUp,
    section: "analytics",
  },
  {
    path: "/subscription",
    label: "View All Records",
    icon: Eye,
    section: "records",
  },
];

export default function LabEntryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedTests, setSelectedTests] = useState<SelectedTest[]>([]);
  const [testValues, setTestValues] = useState<TestValue>({});
  const [testImages, setTestImages] = useState<TestImage>({});
  const [testDescriptions, setTestDescriptions] = useState<TestDescription>({});
  const [testDate, setTestDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [labName, setLabName] = useState<string>("");
  const [doctorName, setDoctorName] = useState<string>("");
  const [openGroups, setOpenGroups] = useState<OpenGroups>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("entry");
  const [testsData, setTestsData] = useState<ApiTest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string>("");
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [testsList, setTestsList] = useState<any[]>([]);
  const [loadingTests, setLoadingTests] = useState<boolean>(false);
  const { data: session, status } = useSession();

  //redux
  const { user } = useSelector((state: RootState) => state.auth);

  const profileData = {
    name: user
      ? `${user.first_name} ${user.last_name ? user.last_name : ""}`
      : "",
    email: user?.email || "",
    role: user ? `${user.subType}` : "",
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchTests();
        // Your API returns { data: [...] }, so set that
        setTestsData(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace("/api", "") || "";

  // set default value when testsData is available
  useEffect(() => {
    if (testsData?.length > 0 && !selected) {
      // pick the one with lowest priority
      const defaultTest = [...testsData].sort(
        (a, b) => a.priyority - b.priyority
      )[0];

      if (defaultTest) {
        handleTestSelectGroup(defaultTest.id);
        setSelected(defaultTest.name);
        setSelectedTestId(defaultTest.id);
      }
    }
  }, [testsData, selected]);

  //test select
  const handleTestSelectGroup = async (id: number) => {
    const test = testsData.find((t) => t.id === id);
    if (test) setSelected(test.name);

    setSelectedTestId(id);
    setLoadingTests(true);

    try {
      const res = await selectTest(id);
      if (res?.data) {
        const sorted = res.data.sort(
          (a: any, b: any) => a.priyority - b.priyority
        );
        setTestsList(sorted);
      }
    } catch (err) {
      console.error("Error fetching tests:", err);
    } finally {
      setLoadingTests(false);
    }
  };

  // for logout
  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: (session as any)?.data?.user?.data?.token,
        }),
      });

      if (!response.ok) {
        console.error("Logout API failed:", response.statusText);
      }

      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  //single select
  const handleTestSelect = (
    parameter: TestParameter,
    groupId: string,
    groupName: string
  ) => {
    const testKey = `${groupId}_${parameter.id}`;
    const testData: SelectedTest = {
      key: testKey,
      groupId,
      groupName,
      testId: parameter.id,
      testName: parameter.name,
      unit: parameter.measurement_unit || parameter.unit,
      normalRange:
        parameter.start_range && parameter.end_range
          ? `${parameter.start_range} - ${parameter.end_range}`
          : null,
      category: parameter.category || groupName,
    };

    setSelectedTests((prev) => {
      const exists = prev.find((t) => t.key === testKey);
      return exists
        ? prev.filter((t) => t.key !== testKey)
        : [...prev, testData];
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
    normalRange: string | null
  ): string => {
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

    // Build the payload
    const payload = {
      date_of_test: testDate || "",
      lab_name: labName || "Not specified",
      doctor_name: doctorName || "Not specified",
      tests: selectedTests
        .filter((test) => testValues[test.key]) // Only include tests with values
        .map((test) => ({
          test_id: test.id || "", // if you already have test_id from API
          group_id: test.group_id || "", // add group_id from your test object
          parameter_id: test.key, // or test.parameter_id if available
          test_value: testValues[test.key],
          test_report: testImages[test.key] || "",
          description: testDescriptions[test.key] || "",
          remark: getParameterStatus(testValues[test.key], test.normalRange),
        })),
    };

    console.log(payload);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

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
      category: param.category || group.name,
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

  const isActive = (path: string) => pathname === path;

  return (
    <MainLayout>
      <div>
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

          {activeSection === "entry" && <TestEntry />}

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
    </MainLayout>
  );
}

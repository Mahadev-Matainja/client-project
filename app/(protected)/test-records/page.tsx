"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Building,
  Share,
  Trash2,
} from "lucide-react";
import MainLayout from "@/components/layout/main-layout";
import FilterWidget from "./components/FilterWidget";
import api from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";

interface TestRecord {
  id: string;
  date: string;
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: "normal" | "high" | "low" | "critical";
  lab: string;
  doctor: string;
  notes?: string;
}

export type TestRecordFilter = {
  test: string;
  group: string;
  parameter: string;
  startDate: Date | null;
  endDate: Date | null;
};

const today = new Date();
const oneMonthAgo = new Date();
const oneYearAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);
oneYearAgo.setFullYear(today.getFullYear() - 1);

// Format the dates to "yyyy-mm-dd"
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function TestRecordsPage() {
  // Define initialValue **inside the component**
  const initialValue: TestRecordFilter = {
    test: "Please Select Test",
    group: "Please Select Group",
    parameter: "Please Select Parameter",
    startDate: oneYearAgo,
    endDate: today,
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<TestRecord | null>(null);
  const [filter, setFilter] = useState<TestRecordFilter>(initialValue);
  const [testRecords, setTestRecords] = useState<TestRecord[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let parametersCache: Record<string, any> = {};

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const payload = {
        test_id: filter.test === "Please Select Test" ? null : filter.test,
        group_id: filter.group === "Please Select Group" ? null : filter.group,
        parameter_id:
          filter.parameter === "Please Select Parameter"
            ? null
            : filter.parameter,
        start_date: filter.startDate ? formatDate(filter.startDate) : null,
        end_date: filter.endDate ? formatDate(filter.endDate) : null,
      };

      const { data } = await api.post(
        `/test/records?page=${currentPage}`,
        payload
      );

      setTotalPage(Number(data.data.last_page));

      const uniqueGroupIds = [
        ...new Set(
          (data?.data?.data ?? []).map((item: any) => String(item.group_id))
        ),
      ] as string[];

      const getParametersForGroup = async (groupId: string) => {
        if (parametersCache[groupId]) return parametersCache[groupId];
        const result = await api.get(`/tests/group/${groupId}/parameters`);
        parametersCache[groupId] = result.data.data;
        return result.data.data;
      };

      const parametersForGroups = await Promise.all(
        uniqueGroupIds.map((groupId) => getParametersForGroup(String(groupId)))
      );

      const groupParametersMap = uniqueGroupIds.reduce(
        (acc, groupId, index) => {
          acc[groupId] = parametersForGroups[index];
          return acc;
        },
        {} as Record<string, any>
      );

      const records: TestRecord[] = data.data.data.map((item: any) => {
        const parameters = groupParametersMap[item.group_id];
        const parameter = parameters?.find(
          (p: any) => String(p.id) === String(item.parameter_id)
        );

        return {
          id: item.id,
          date: new Date(item.date_of_test).toISOString().split("T")[0],
          testName: parameter?.name || "",
          value: item.test_value,
          unit: parameter?.unit || "",
          referenceRange: `${parameter?.start_range || ""} - ${
            parameter?.end_range || ""
          }`,
          status: item.remark,
          lab: item.lab_name,
          doctor: item.doctor_name,
          notes: item.notes,
        };
      });

      setTestRecords(records);
      setIsLoading(false);
    };

    fetchData();
  }, [filter, currentPage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4" />;
      case "high":
      case "low":
        return <AlertCircle className="h-4 w-4" />;
      case "critical":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredRecords = testRecords.filter((record) => {
    const matchesSearch =
      record.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.lab.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;

    const matchesDate =
      dateRange === "all" ||
      (dateRange === "30days" &&
        new Date(record.date) >=
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
      (dateRange === "90days" &&
        new Date(record.date) >=
          new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) ||
      (dateRange === "1year" &&
        new Date(record.date) >=
          new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getRecordStats = () => {
    const total = filteredRecords.length;
    const normal = filteredRecords.filter((r) => r.status === "normal").length;
    const abnormal = filteredRecords.filter(
      (r) => r.status !== "normal"
    ).length;
    const critical = filteredRecords.filter(
      (r) => r.status === "critical"
    ).length;
    return { total, normal, abnormal, critical };
  };

  const stats = getRecordStats();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Report Records</h1>
            <p className="text-gray-600">
              View and manage all your lab test results
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Records
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Share className="h-4 w-4" />
              Share with Doctor
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Records
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Normal Results
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.normal}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Abnormal Results
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.abnormal}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Critical Results
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.critical}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <FilterWidget
          filter={filter}
          setFilter={setFilter}
          response={isLoading}
        />

        {/* Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Test Results (
              {isLoading ? <>Loading...</> : filteredRecords.length})
            </CardTitle>
            <CardDescription>
              Your lab test results with reference ranges and status indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <div className="grid gap-4">
                  <Skeleton className="w-full h-20 bg-gray-400" />
                  <Skeleton className="w-full h-20 bg-gray-400" />
                  <Skeleton className="w-full h-20 bg-gray-400" />
                  <Skeleton className="w-full h-20 bg-gray-400" />
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {filteredRecords.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No records found</p>
                    <p className="text-sm">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                ) : (
                  filteredRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-50 rounded-full">
                          {getStatusIcon(record.status)}
                        </div>
                        <div>
                          <h4 className="font-medium">{record.testName}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {record.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {record.doctor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {record.lab}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold">
                            {record.value} {record.unit}
                          </div>
                          <div className="text-sm text-gray-600">
                            Ref: {record.referenceRange}
                          </div>
                        </div>
                        <Badge
                          className={`gap-1 ${getStatusColor(record.status)}`}
                        >
                          {record.status}
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedRecord(record)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {record.testName} - Detailed View
                              </DialogTitle>
                              <DialogDescription>
                                Complete information about this test result
                              </DialogDescription>
                            </DialogHeader>
                            {selectedRecord && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Test Date
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                      {selectedRecord.date}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Status
                                    </Label>
                                    <Badge
                                      className={`gap-1 ${getStatusColor(
                                        selectedRecord.status
                                      )} mt-1`}
                                    >
                                      {getStatusIcon(selectedRecord.status)}
                                      {selectedRecord.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Result
                                    </Label>
                                    <p className="text-lg font-semibold">
                                      {selectedRecord.value}{" "}
                                      {selectedRecord.unit}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Reference Range
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                      {selectedRecord.referenceRange}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Laboratory
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                      {selectedRecord.lab}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Ordering Doctor
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                      {selectedRecord.doctor}
                                    </p>
                                  </div>
                                </div>
                                {selectedRecord.notes && (
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Notes
                                    </Label>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {selectedRecord.notes}
                                    </p>
                                  </div>
                                )}
                                <Separator />
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 bg-transparent"
                                  >
                                    <Download className="h-4 w-4" />
                                    Export
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 bg-transparent"
                                  >
                                    <Share className="h-4 w-4" />
                                    Share
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex items-center justify-between w-full">
              {/* Pagination Controls */}
              <div className="space-x-2">
                <Button
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPage}
                </span>
                <Button
                  onClick={() => {
                    if (currentPage < totalPage) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  disabled={currentPage === totalPage}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}

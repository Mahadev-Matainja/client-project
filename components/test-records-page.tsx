"use client";

import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Search,
  Download,
  Eye,
  Trash2,
  Calendar,
  FileText,
  ImageIcon,
  MoreVertical,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface TestRecord {
  id: string;
  testName: string;
  groupName: string;
  value: string;
  unit: string;
  normalRange: string;
  status: "normal" | "high" | "low" | "pending";
  date: string;
  labName: string;
  doctorName: string;
  description?: string;
  image?: string;
  timestamp: string;
}

interface TestRecordsPageProps {
  testRecords?: TestRecord[];
  onNavigateBack?: () => void;
  onDeleteRecord?: (recordId: string) => void;
}

export default function TestRecordsPage({
  testRecords = [],
  onNavigateBack,
  onDeleteRecord,
}: TestRecordsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGroup, setFilterGroup] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedRecord, setSelectedRecord] = useState<TestRecord | null>(null);

  // Get unique groups for filter
  const uniqueGroups = [
    ...new Set(testRecords.map((record) => record.groupName)),
  ];

  // Filter and sort records
  const filteredRecords = testRecords
    .filter((record) => {
      const matchesSearch =
        record.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.groupName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || record.status === filterStatus;
      const matchesGroup =
        filterGroup === "all" || record.groupName === filterGroup;
      return matchesSearch && matchesStatus && matchesGroup;
    })
    .sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "testName":
          aValue = a.testName.toLowerCase();
          bValue = b.testName.toLowerCase();
          break;
        case "value":
          aValue = Number.parseFloat(a.value) || 0;
          bValue = Number.parseFloat(b.value) || 0;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusIcon = (status: TestRecord["status"]) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "high":
      case "low":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: TestRecord["status"]) => {
    switch (status) {
      case "normal":
        return "default";
      case "high":
      case "low":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const exportRecords = () => {
    const csvContent = [
      [
        "Date",
        "Test Name",
        "Group",
        "Value",
        "Unit",
        "Normal Range",
        "Status",
        "Lab",
        "Doctor",
        "Notes",
      ],
      ...filteredRecords.map((record) => [
        record.date,
        record.testName,
        record.groupName,
        record.value,
        record.unit,
        record.normalRange,
        record.status,
        record.labName,
        record.doctorName,
        record.description || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `test-records-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Group records by date for better organization
  const recordsByDate = filteredRecords.reduce(
    (acc: Record<string, TestRecord[]>, record) => {
      const date = record.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    },
    {}
  );

  const sortedDates = Object.keys(recordsByDate).sort((a, b) =>
    sortOrder === "desc"
      ? new Date(b).getTime() - new Date(a).getTime()
      : new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onNavigateBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Entry
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Test Records</h1>
              <p className="text-gray-600">
                View and manage all your lab test results
              </p>
            </div>
          </div>
          <Button onClick={exportRecords} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Tests</p>
                  <p className="text-2xl font-bold">{testRecords.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Normal Results</p>
                  <p className="text-2xl font-bold">
                    {testRecords.filter((r) => r.status === "normal").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Abnormal Results</p>
                  <p className="text-2xl font-bold">
                    {
                      testRecords.filter(
                        (r) => r.status === "high" || r.status === "low"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Test Groups</p>
                  <p className="text-2xl font-bold">{uniqueGroups.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tests or groups..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchTerm(e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterGroup} onValueChange={setFilterGroup}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {uniqueGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(value: string) => {
                  const [field, order] = value.split("-");
                  setSortBy(field);
                  setSortOrder(order);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Date (Newest)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                  <SelectItem value="testName-asc">Test Name (A-Z)</SelectItem>
                  <SelectItem value="testName-desc">Test Name (Z-A)</SelectItem>
                  <SelectItem value="status-asc">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Records Display */}
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No test records found
              </h3>
              <p className="text-gray-600 mb-4">
                {testRecords.length === 0
                  ? "You haven't saved any test results yet."
                  : "No records match your current filters."}
              </p>
              <Button onClick={onNavigateBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Add Test Results
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((date) => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {formatDate(date)}
                    <Badge variant="outline" className="ml-2">
                      {recordsByDate[date].length} tests
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test Name</TableHead>
                          <TableHead>Group</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Normal Range</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Lab/Doctor</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recordsByDate[date].map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">
                              {record.testName}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {record.groupName}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold">
                                {record.value}
                              </span>
                              <span className="text-gray-500 ml-1">
                                {record.unit}
                              </span>
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {record.normalRange}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(record.status)}
                                <Badge variant={getStatusColor(record.status)}>
                                  {record.status.charAt(0).toUpperCase() +
                                    record.status.slice(1)}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p className="font-medium">{record.labName}</p>
                                <p className="text-gray-600">
                                  {record.doctorName}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => setSelectedRecord(record)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  {record.image && (
                                    <DropdownMenuItem
                                      onClick={() => setSelectedRecord(record)}
                                    >
                                      <ImageIcon className="h-4 w-4 mr-2" />
                                      View Image
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() =>
                                      onDeleteRecord &&
                                      onDeleteRecord(record.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Record Details Modal */}
        {selectedRecord && (
          <Dialog
            open={!!selectedRecord}
            onOpenChange={() => setSelectedRecord(null)}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedRecord.testName} - Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Test Group
                    </Label>
                    <p className="font-semibold">{selectedRecord.groupName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Test Date
                    </Label>
                    <p className="font-semibold">
                      {formatDate(selectedRecord.date)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Result
                    </Label>
                    <p className="font-semibold">
                      {selectedRecord.value} {selectedRecord.unit}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Normal Range
                    </Label>
                    <p className="font-semibold">
                      {selectedRecord.normalRange}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Status
                    </Label>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedRecord.status)}
                      <Badge variant={getStatusColor(selectedRecord.status)}>
                        {selectedRecord.status.charAt(0).toUpperCase() +
                          selectedRecord.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Lab Name
                    </Label>
                    <p className="font-semibold">{selectedRecord.labName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Doctor Name
                    </Label>
                    <p className="font-semibold">{selectedRecord.doctorName}</p>
                  </div>
                </div>

                {selectedRecord.description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Notes
                    </Label>
                    <p className="mt-1 p-3 bg-gray-50 rounded-lg">
                      {selectedRecord.description}
                    </p>
                  </div>
                )}

                {selectedRecord.image && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Test Report Image
                    </Label>
                    <img
                      src={selectedRecord.image || "/placeholder.svg"}
                      alt="Test Report"
                      className="mt-2 w-full h-auto rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

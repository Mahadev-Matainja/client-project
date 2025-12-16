"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Heart,
  Droplets,
  Thermometer,
  TrendingUp,
  TrendingDown,
  FileText,
  Plus,
  Clock,
  Crown,
  Star,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MainLayout from "@/components/layout/main-layout";
import { useRouter } from "next/navigation";
import HealthMetrics from "./components/HealthMetrics";
import { fetchDashboardGraph } from "@/services/DashboardService";
import ShimmerCard from "./components/ShimmerCard";
import DashboardCard from "./components/DashboardCard";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const router = useRouter();

  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [cholesterolTrend, setCholesterolTrend] = useState<any[]>([]);
  const [bloodPressureData, setBloodPressureData] = useState<any[]>([]);
  const [latestResults, setLatestResults] = useState<any[]>([]);

  const healthGoals = [
    { name: "Daily Steps", current: 8500, target: 10000, unit: "steps" },
    { name: "Water Intake", current: 6, target: 8, unit: "glasses" },
    { name: "Sleep Hours", current: 7.5, target: 8, unit: "hours" },
    { name: "Exercise Minutes", current: 25, target: 30, unit: "minutes" },
  ];

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetchDashboardGraph();

        const cholesterol =
          res?.data?.cholesterol?.map((item: any, i: number) => ({
            id: i,
            date: item.date,
            total: item.total ?? 0,
            ldl: item.ldl ?? 0,
            hdl: item.hdl ?? 0,
          })) || [];

        const bloodPressure =
          res?.data?.bloodPressure?.map((item: any, i: number) => ({
            id: i,
            date: item.date,
            systolic: item.Systolic ?? 0,
            diastolic: item.Diastolic ?? 0,
          })) || [];

        const latestResult =
          res?.data?.latestResults?.map((item: any, i: number) => ({
            id: i,
            parameter: item.parameter || "Unknown",
            key: item.key || "",
            value: item.value ?? 0,
            date: item.date || "",
            name: item.name || "",
            unit: item.unit || "",
          })) || [];

        setCholesterolTrend(cholesterol);
        setBloodPressureData(bloodPressure);
        setLatestResults(latestResult);
      } catch (error) {
        console.error("Error loading analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header with Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Health Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! Here's your health overview for today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={() => router.push("/lab-entry")}
            >
              <Plus className="h-4 w-4" />
              Add Test Result
            </Button>
            <Button
              className="gap-2 bg-[#aa0000]"
              onClick={() => router.push("/subscription")}
            >
              <Crown className="h-4 w-4" />
              Upgrade Plan
            </Button>
          </div>
        </div>

        {/* Subscription Status Banner */}
        {/* <Card className="border-[#00aad450] bg-gradient-to-r from-[#fb2c3650] to-[#00aad480]">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Crown className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Silver Plan Active
                  </h3>
                  <p className="text-sm text-gray-600">
                    15 of 20 test entries used this month • Records saved for 1
                    year
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="gap-2 bg-transparent border-white w-full sm:w-auto"
                onClick={() => router.push("/subscription")}
              >
                <Star className="h-4 w-4" />
                Upgrade to Gold
              </Button>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Monthly Usage</span>
                <span>15/20 entries</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card> */}

        {/* Vital Statistics */}

        <HealthMetrics />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blood Pressure Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Blood Pressure Trend
              </CardTitle>
              <CardDescription>
                Your blood pressure readings over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <ShimmerCard />
              ) : bloodPressureData && bloodPressureData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bloodPressureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="systolic"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Systolic"
                    />
                    <Line
                      type="monotone"
                      dataKey="diastolic"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Diastolic"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <p>No blood pressure data available.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cholesterol Levels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Cholesterol Levels
              </CardTitle>
              <CardDescription>
                Total, LDL, and HDL cholesterol trends
              </CardDescription>
            </CardHeader>

            <CardContent>
              {loading ? (
                <ShimmerCard />
              ) : cholesterolTrend && cholesterolTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cholesterolTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#8884d8" name="Total" />
                    <Bar dataKey="ldl" fill="#82ca9d" name="LDL" />
                    <Bar dataKey="hdl" fill="#ffc658" name="HDL" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <p>No cholesterol data available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Tests and Health Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Test Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Recent Test Results
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/test-records")}
                >
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {loading ? (
                <ShimmerCard />
              ) : latestResults && latestResults.length > 0 ? (
                <div className="space-y-4">
                  {latestResults.map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-full">
                          {test.status === "completed" ? (
                            <CheckCircle className="h-4 w-4 text-[#00aad4]" />
                          ) : (
                            <Clock className="h-4 w-4 text-[#00aad4]" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{test.parameter}</h4>
                          <p className="text-sm text-gray-600">
                            {test.date} • {test.name}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          test.result === "Normal"
                            ? "bg-green-100 text-green-800"
                            : test.result === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-400 text-white"
                        }
                      >
                        {test.value} {test.unit}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                // 🔹 Empty state if no results
                <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                  <p>No recent test results available.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Goals */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-500" />
                Today's Health Goals
              </CardTitle>
              <CardDescription>
                Track your daily health and wellness targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {healthGoals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{goal.name}</span>
                      <span className="text-sm text-gray-600">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                    </div>
                    <Progress
                      value={(goal.current / goal.target) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used features and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-transparent"
                onClick={() => router.push("/lab-entry")}
              >
                <Plus className="h-5 w-5" />
                <span className="text-sm">Add Test</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-transparent"
                onClick={() => router.push("/test-records")}
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm">View Records</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-transparent"
                onClick={() => router.push("/analytics")}
              >
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">Analytics</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-transparent"
                onClick={() => router.push("/subscription")}
              >
                <Crown className="h-5 w-5" />
                <span className="text-sm">Upgrade</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

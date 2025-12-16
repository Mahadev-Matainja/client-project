"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  Droplets,
  Calendar,
  Download,
  Share,
  AlertCircle,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import MainLayout from "@/components/layout/main-layout";
import { Pencil } from "lucide-react";
import AnalyticsCard from "./components/AnalyticsCard";
import { fetchAnalyticsGraph } from "@/services/AnalyticsService";
import CustomBPTooltip from "./components/CustomBPTooltip";

type TestFrequencyItem = {
  name: string;
  count: number;
  color: string;
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("3months");
  const [cholesterolTrend, setCholesterolTrend] = useState([]);
  const [bloodPressureTrend, setBloodPressureTrend] = useState([]);
  const [testFrequency, setTestFrequency] = useState<TestFrequencyItem[]>([]);
  const [glucoseTrend, setGlucoseTrend] = useState();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetchAnalyticsGraph({ timeRange });
        // Handle missing or null data gracefully
        const cholesterol =
          res?.data?.data?.cholesterol?.map((item: any) => ({
            month: item.date,
            total: item.total ?? 0,
            ldl: item.ldl ?? 0,
            hdl: item.hdl ?? 0,
          })) || [];

        const bloodPressure =
          res?.data?.data?.bloodPressure?.map((item: any) => ({
            month: item.date,
            systolic: item.Systolic ?? 0,
            diastolic: item.Diastolic ?? 0,
          })) || [];

        const glucose =
          res?.data?.data?.glucose?.map((item: any) => ({
            month: item.date,
            fasting: item.fasting ?? 0,
            postMeal: item.post_meal ?? 0,
          })) || [];

        const testFrequency =
          res?.data?.data?.test_frequency?.map((item: any) => ({
            name: item.name ?? "Unknown",
            count: item.count ?? 0,
            color: item.color ?? "#ccc", // fallback color
          })) || [];

        // ✅ Set states
        setCholesterolTrend(cholesterol);
        setBloodPressureTrend(bloodPressure);
        setGlucoseTrend(glucose);
        setTestFrequency(testFrequency);
      } catch (error) {
        console.error("Error loading analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [timeRange]);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Health Analytics</h1>
            <p className="text-gray-600">
              Track your health trends and progress over time
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
                <SelectItem value="2years">Last 2 Years</SelectItem>
              </SelectContent>
            </Select>
            {/* <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Share className="h-4 w-4" />
              Share with Doctor
            </Button> */}
          </div>
        </div>

        {/* Health Metrics Overview */}
        <AnalyticsCard />

        {/* Charts Section */}

        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading....</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cholesterol Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Cholesterol Trend
                </CardTitle>
                <CardDescription>
                  Total, LDL, and HDL cholesterol levels over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cholesterolTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Total"
                    />
                    <Line
                      type="monotone"
                      dataKey="ldl"
                      stroke="#ff7300"
                      strokeWidth={2}
                      name="LDL"
                    />
                    <Line
                      type="monotone"
                      dataKey="hdl"
                      stroke="#00ff00"
                      strokeWidth={2}
                      name="HDL"
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Improvement Detected
                  </span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Your total cholesterol has decreased by 25 mg/dL over the past
                  6 months
                </p>
              </div> */}
              </CardContent>
            </Card>

            {/* Blood Pressure Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Blood Pressure Trend
                </CardTitle>
                <CardDescription>
                  Systolic and diastolic pressure readings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bloodPressureTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomBPTooltip />} />
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

                {/* <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Within Normal Range
                  </span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Your blood pressure is consistently within the normal range
                </p>
              </div> */}
              </CardContent>
            </Card>

            {/* Glucose Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-purple-500" />
                  Glucose Levels
                </CardTitle>
                <CardDescription>
                  Fasting and post-meal glucose readings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={glucoseTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="fasting" fill="#8884d8" name="Fasting" />
                    <Bar dataKey="postMeal" fill="#82ca9d" name="Post-Meal" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">
                      Excellent Control
                    </span>
                  </div>
                  <p className="text-sm text-purple-700 mt-1">
                    Both fasting and post-meal glucose levels are well
                    controlled
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Test Frequency */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  Test Frequency
                </CardTitle>
                <CardDescription>
                  Distribution of tests performed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={testFrequency}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent = 0 }) =>
                        `${name} ${((percent as number) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {testFrequency.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {testFrequency.map((test, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: test.color }}
                        />
                        <span>{test.name}</span>
                      </div>
                      <span className="font-medium">{test.count} tests</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Health Insights */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Health Insights & Recommendations
            </CardTitle>
            <CardDescription>
              AI-powered insights based on your test results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800">
                      Positive Trend
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      Your cholesterol levels have shown consistent improvement
                      over the past 6 months. Keep up with your current diet and
                      exercise routine.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">
                      Stable Metrics
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your blood pressure remains stable and within normal
                      ranges. Continue monitoring regularly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">
                      Recommendation
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Consider increasing HDL cholesterol through regular
                      aerobic exercise and omega-3 rich foods.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-purple-800">
                      Next Steps
                    </h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Schedule your next comprehensive metabolic panel in 3
                      months to continue monitoring progress.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </MainLayout>
  );
}

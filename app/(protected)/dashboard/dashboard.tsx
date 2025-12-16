"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import MainLayout from "@/components/layout/main-layout"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")

  // Sample data for charts
  const bloodPressureData = [
    { date: "Jan", systolic: 120, diastolic: 80 },
    { date: "Feb", systolic: 118, diastolic: 78 },
    { date: "Mar", systolic: 122, diastolic: 82 },
    { date: "Apr", systolic: 119, diastolic: 79 },
    { date: "May", systolic: 121, diastolic: 81 },
    { date: "Jun", systolic: 117, diastolic: 77 },
  ]

  const cholesterolData = [
    { month: "Jan", total: 180, ldl: 100, hdl: 60 },
    { month: "Feb", total: 175, ldl: 95, hdl: 62 },
    { month: "Mar", total: 170, ldl: 90, hdl: 65 },
    { month: "Apr", total: 165, ldl: 85, hdl: 68 },
    { month: "May", total: 160, ldl: 80, hdl: 70 },
    { month: "Jun", total: 155, ldl: 75, hdl: 72 },
  ]

  const vitalStats = [
    {
      title: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      status: "normal",
      change: -2,
      icon: <Heart className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Heart Rate",
      value: "72",
      unit: "bpm",
      status: "normal",
      change: 1,
      icon: <Activity className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Blood Sugar",
      value: "95",
      unit: "mg/dL",
      status: "normal",
      change: -5,
      icon: <Droplets className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Body Temperature",
      value: "98.6",
      unit: "°F",
      status: "normal",
      change: 0,
      icon: <Thermometer className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const recentTests = [
    {
      id: 1,
      name: "Complete Blood Count",
      date: "2024-01-15",
      status: "completed",
      result: "Normal",
      doctor: "Dr. Smith",
    },
    {
      id: 2,
      name: "Lipid Profile",
      date: "2024-01-10",
      status: "completed",
      result: "Attention Needed",
      doctor: "Dr. Johnson",
    },
    {
      id: 3,
      name: "Thyroid Function",
      date: "2024-01-05",
      status: "pending",
      result: "Pending",
      doctor: "Dr. Brown",
    },
  ]

  const healthGoals = [
    { name: "Daily Steps", current: 8500, target: 10000, unit: "steps" },
    { name: "Water Intake", current: 6, target: 8, unit: "glasses" },
    { name: "Sleep Hours", current: 7.5, target: 8, unit: "hours" },
    { name: "Exercise Minutes", current: 25, target: 30, unit: "minutes" },
  ]

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header with Quick Actions */}
        {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your health overview for today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 bg-transparent" onClick={() => router.push("/lab-entry")}>
              <Plus className="h-4 w-4" />
              Add Test Result
            </Button>
            <Button className="gap-2" onClick={() => router.push("/subscription")}>
              <Crown className="h-4 w-4" />
              Upgrade Plan
            </Button>
          </div>
        </div> */}

        {/* Subscription Status Banner */}
        {/* <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Crown className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Silver Plan Active</h3>
                  <p className="text-sm text-gray-600">
                    15 of 20 test entries used this month • Records saved for 1 year
                  </p>
                </div>
              </div>
              <Button variant="outline" className="gap-2 bg-transparent" onClick={() => router.push("/subscription")}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vitalStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <div className={stat.color}>{stat.icon}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {stat.value}
                      <span className="text-sm font-normal text-gray-500 ml-1">{stat.unit}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      {stat.change > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : stat.change < 0 ? (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      ) : null}
                      <span
                        className={
                          stat.change > 0 ? "text-green-600" : stat.change < 0 ? "text-red-600" : "text-gray-500"
                        }
                      >
                        {stat.change !== 0 && (stat.change > 0 ? "+" : "")}
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900">{stat.title}</h3>
                  <Badge
                    variant={stat.status === "normal" ? "default" : "destructive"}
                    className={stat.status === "normal" ? "bg-green-100 text-green-800" : ""}
                  >
                    {stat.status === "normal" ? "Normal" : "Attention"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blood Pressure Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Blood Pressure Trend
              </CardTitle>
              <CardDescription>Your blood pressure readings over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bloodPressureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} name="Systolic" />
                  <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={2} name="Diastolic" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cholesterol Levels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Cholesterol Levels
              </CardTitle>
              <CardDescription>Total, LDL, and HDL cholesterol trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cholesterolData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#8884d8" name="Total" />
                  <Bar dataKey="ldl" fill="#82ca9d" name="LDL" />
                  <Bar dataKey="hdl" fill="#ffc658" name="HDL" />
                </BarChart>
              </ResponsiveContainer>
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
                <Button variant="ghost" size="sm" onClick={() => router.push("/test-records")}>
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-full">
                        {test.status === "completed" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{test.name}</h4>
                        <p className="text-sm text-gray-600">
                          {test.date} • {test.doctor}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        test.result === "Normal" ? "default" : test.result === "Pending" ? "secondary" : "destructive"
                      }
                      className={
                        test.result === "Normal"
                          ? "bg-green-100 text-green-800"
                          : test.result === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {test.result}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Health Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-500" />
                Today's Health Goals
              </CardTitle>
              <CardDescription>Track your daily health and wellness targets</CardDescription>
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
                    <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features and shortcuts</CardDescription>
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
  )
}

"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Pencil, Loader2 } from "lucide-react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  Droplets,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchTests, selectTest, testparameter } from "@/services/TestsService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchAnalyticsCard, postAnalytics } from "@/services/AnalyticsService";
import { useDispatch, useSelector } from "react-redux";
import { setMetrics } from "@/lib/slices/analyticsSlice";
import { UIMetric } from "@/@types/lab-test";
import { Skeleton } from "@/components/ui/skeleton";

type Test = {
  id: number;
  name: string;
  key: string;
  priyority: number;
  is_default: boolean;
};

type TestGroup = {
  id: number;
  name: string;
  priyority: number;
  parameters?: { id: number; name: string }[];
};

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case "normal":
      return <Heart className="h-5 w-5 text-green-500" />;
    case "high":
      return <Activity className="h-5 w-5 text-red-500" />;
    case "low":
      return <Droplets className="h-5 w-5 text-blue-500" />;
    default:
      return <Heart className="h-5 w-5 text-gray-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "excellent":
      return "bg-green-100 text-green-800";
    case "good":
      return "bg-blue-100 text-blue-800";
    case "improving":
      return "bg-yellow-100 text-yellow-800";
    case "stable":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getChangeIcon = (change: number) => {
  if (change > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
  if (change < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
  return null;
};

const AnalyticsCard: React.FC = () => {
  const dispatch = useDispatch();

  const metrics = useSelector((state: any) => state.analytics.metrics);

  const [testsData, setTestsData] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [groups, setGroups] = useState<TestGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<TestGroup | null>(null);
  const [selectedParameter, setSelectedParameter] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [open, setOpen] = useState<{ metric: any; index: number } | null>(null);
  const [healthMetrics, setHealthMetrics] = useState<UIMetric[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  //fetch initial card api
  useEffect(() => {
    const fetchAllCard = async () => {
      try {
        const res = await fetchAnalyticsCard();
        if (res?.cards) {
          // ✅ Sort & set in Redux
          dispatch(setMetrics(res.cards));
        } else {
          console.warn("No cards found in API response");
        }
      } catch (err) {
        console.error("Error fetching metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCard();
  }, [dispatch]);

  // 1️ Fetch all tests and select default
  useEffect(() => {
    const fetchAllTests = async () => {
      try {
        const res = await fetchTests();
        let data: Test[] = res.data || [];

        // ✅ Hide "Imaging Test" before setting to state
        data = data.filter(
          (test) => test.name.toLowerCase() !== "imaging test"
        );

        setTestsData(data);

        // ✅ Select default test if exists
        const defaultTest = data.find((t) => t.is_default);
        if (defaultTest) {
          setSelectedTest(defaultTest);
        }
      } catch (err) {
        console.error("Error fetching tests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTests();
  }, []);

  // 2️ Fetch groups whenever test changes (default + manual)
  useEffect(() => {
    const fetchGroups = async () => {
      if (!selectedTest) return;
      try {
        setLoadingGroups(true);
        const res = await selectTest(selectedTest.id); // fetch groups
        const sorted = res.data.sort(
          (a: TestGroup, b: TestGroup) => a.priyority - b.priyority
        );
        setGroups(sorted);

        //  Automatically select the first group
        if (sorted.length > 0) {
          setSelectedGroup(sorted[0]);
          // Optional: auto-select first parameter as well
          if (sorted[0].parameters?.length > 0) {
            setSelectedParameter(sorted[0].parameters[0]);
          } else {
            setSelectedParameter(null);
          }
        } else {
          setSelectedGroup(null);
          setSelectedParameter(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingGroups(false);
      }
    };
    fetchGroups();
  }, [selectedTest]);

  const handleSelectTest = (test: Test) => {
    setSelectedTest(test);
    setSelectedGroup(null);
    setSelectedParameter(null);
  };

  const handleSelectGroup = (group: TestGroup) => {
    setSelectedGroup(group);
    setSelectedParameter(null);
  };

  const handleSelectParameter = (param: { id: number; name: string }) => {
    setSelectedParameter(param);
  };
  // useEffect(() => {
  //   if (metrics.length === 0) {
  //     dispatch(setMetrics(healthMetrics));
  //   }
  // }, [metrics.length, dispatch]);

  const handleSave = async () => {
    setLoading(true);
    setErrorMessage(null);
    if (!selectedTest?.id) {
      setErrorMessage("Please select a test before submit.");
      setLoading(false);
      return;
    }

    if (!selectedGroup?.id) {
      setErrorMessage("Please select a group before submit.");
      setLoading(false);
      return;
    }

    if (!selectedParameter?.id) {
      setErrorMessage("Please select a parameter before submit.");
      setLoading(false);
      return;
    }

    const payload = {
      priority: open?.index,
      test_id: selectedTest.id,
      group_id: selectedGroup.id,
      parameter_id: selectedParameter.id,
    };

    try {
      const res = await postAnalytics(payload);
      //  Update Redux state
      dispatch(setMetrics(res.data.cards));
      //  Close the dialog after successful save
      setOpen(null);
    } catch (err: any) {
      console.error("Error saving analytics:", err);
      setErrorMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-10 w-10 rounded-full bg-gray-300" />
                  <Skeleton className="h-6 w-16 rounded bg-gray-300" />
                </div>
                <div className="mt-4 space-y-3">
                  <Skeleton className="h-8 w-24 bg-gray-300" />
                  <Skeleton className="h-5 w-20 bg-gray-300" />
                  <Skeleton className="h-5 w-32 bg-gray-300" />
                </div>
              </Card>
            ))
          : metrics.map((metric: UIMetric, index: number) => (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow relative"
              >
                <CardContent className="p-6">
                  <button
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
                    onClick={() => setOpen({ metric, index: index + 1 })}
                  >
                    <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                  </button>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-50 rounded-full">
                      {getStatusIcon(metric.status)}
                    </div>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">
                      {metric.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      {/* Left side — main value */}
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                          {metric.value}
                        </span>
                        <span className="text-2xl font-bold text-gray-900">
                          {metric.unit}
                        </span>
                      </div>

                      {/* Right side — normal range */}
                      <div className="flex flex-col items-end text-sm text-gray-600">
                        <span className="text-xs text-gray-500">Range</span>
                        <span className="text-xs text-green-600 font-medium">
                          {metric.normal_range} {metric.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select Parameter</DialogTitle>
                      {/* <DialogDescription>
                        Update the details for <b>{metric.title}</b>.
                      </DialogDescription> */}
                    </DialogHeader>

                    {/* Test Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="w-full flex items-center justify-between border rounded-md px-3 py-2 bg-white cursor-pointer">
                          <span>{selectedTest?.name || "Select Test"}</span>
                          <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] p-2">
                        <Input
                          type="text"
                          placeholder="Search..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <ScrollArea className="max-h-60">
                          {loading ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            testsData
                              .filter((t) =>
                                t.name
                                  .toLowerCase()
                                  .includes(search.toLowerCase())
                              )
                              .map((t) => (
                                <DropdownMenuItem
                                  key={t.id}
                                  onSelect={() => handleSelectTest(t)}
                                >
                                  {t.name}
                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                </DropdownMenuItem>
                              ))
                          )}
                        </ScrollArea>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <div>
                      {loadingGroups ? (
                        <span>Loading Groups...</span>
                      ) : (
                        <>
                          {/* Group Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div className="w-full flex items-center justify-between border rounded-md px-3 py-2 bg-white cursor-pointer mt-2">
                                <span>
                                  {selectedGroup?.name || "Select Group"}
                                </span>
                                <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] p-2">
                              <Input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                              />
                              <ScrollArea className="max-h-60">
                                {loadingGroups ? (
                                  <Loader2 className="animate-spin" />
                                ) : (
                                  groups
                                    .filter((g) =>
                                      g.name
                                        .toLowerCase()
                                        .includes(search.toLowerCase())
                                    )
                                    .map((g) => (
                                      <DropdownMenuItem
                                        key={g.id}
                                        onSelect={() => handleSelectGroup(g)}
                                      >
                                        {g.name}
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                      </DropdownMenuItem>
                                    ))
                                )}
                              </ScrollArea>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          {/* Parameter Dropdown */}
                          {selectedGroup?.parameters && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <div className="w-full flex items-center justify-between border rounded-md px-3 py-2 bg-white cursor-pointer mt-2">
                                  <span>
                                    {selectedParameter?.name ||
                                      "Select Parameter"}
                                  </span>
                                  <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
                                </div>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] p-2">
                                {/*  Search input */}
                                <Input
                                  type="text"
                                  placeholder="Search..."
                                  value={search}
                                  onChange={(e) => setSearch(e.target.value)}
                                />

                                <ScrollArea className="max-h-60">
                                  {selectedGroup.parameters
                                    .filter((p) =>
                                      p.name
                                        .toLowerCase()
                                        .includes(search.toLowerCase())
                                    )
                                    .map((p) => (
                                      <DropdownMenuItem
                                        key={p.id}
                                        onSelect={() =>
                                          handleSelectParameter(p)
                                        }
                                      >
                                        {p.name}
                                        {/* <ChevronRight className="w-4 h-4 text-gray-400" /> */}
                                      </DropdownMenuItem>
                                    ))}
                                </ScrollArea>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </>
                      )}
                    </div>
                    {errorMessage && (
                      <h2 className="text-red-600 text-sm mt-2">
                        {errorMessage}
                      </h2>
                    )}
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant="secondary"
                          onClick={() => setOpen(null)}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        disabled={loading}
                        className=" bg-blue-600 hover:bg-blue-400"
                        onClick={handleSave}
                      >
                        {loading ? "Saving..." : "Submit"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default AnalyticsCard;

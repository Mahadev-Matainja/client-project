"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Activity,
  Droplets,
  Thermometer,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchVitalStats } from "@/services/DashboardService";
import api from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { setVitalStats, updateStat } from "@/lib/slices/vitalStatsSlice";
import { RootState } from "@/lib/store";

const HealthMetrics = () => {
  const dispatch = useDispatch();
  const vitalStats = useSelector((state: any) => state.vitalStats.vitalStats);

  const [selectedStat, setSelectedStat] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const iconMap: Record<string, React.ReactNode> = {
    heart: <Heart className="h-6 w-6 text-white" />,
    activity: <Activity className="h-6 w-6 text-white" />,
    droplets: <Droplets className="h-6 w-6 text-white" />,
    thermometer: <Thermometer className="h-6 w-6 text-white" />,
  };

  const { user } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchVitalStats();
        dispatch(setVitalStats(res));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [dispatch]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent, stat: any) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({}); // clear old errors

    const errors: Record<string, string> = {};
    stat.required.forEach((field: string) => {
      const key = field.toLowerCase();
      if (!formData[key]) errors[key] = `${field} is required`;
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    const payload: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      payload[key.toLowerCase()] = value;
    });

    try {
      const response = await api.post(stat.api, payload);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to save");
      }

      // ✅ Update Redux immediately with API response
      dispatch(updateStat({ title: stat.title, data: response.data.data }));

      setSelectedStat(null);
      setFormErrors({});
      setFormData({});
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        Object.entries(error.response.data.errors).forEach(
          ([field, messages]) => {
            apiErrors[field] = (messages as string[])[0]; // take first message
          }
        );
        setFormErrors(apiErrors);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  };

  return (
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
        : vitalStats.map((stat: any, index: number) => (
            <Card
              key={index}
              className={`hover:shadow-md transition-shadow ${
                index % 2 === 0
                  ? "bg-gradient-to-tr from-[#2ad5ff] to-[#00aad4]"
                  : "bg-gradient-to-tr from-[#ff0000] to-[#aa0000]"
              }`}
            >
              <div className="flex items-center justify-between mr-4 mt-2 px-6">
                <div>
                  {stat.date && (
                    <span className="text-white text-xs">
                      {formatDate(stat.date)}
                    </span>
                  )}
                </div>
                {/* <button
                  onClick={() => setSelectedStat(stat)}
                  className="text-white hover:underline hover:text-gray-600 cursor-pointer text-xs"
                >
                  Add
                </button> */}
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-full bg-black/20">
                    <div>{iconMap[stat.icon]}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {stat.value}
                      <span
                        className={`text-sm font-normal ml-1 ${
                          index % 2 === 0 ? "text-gray-900" : "text-white"
                        }`}
                      >
                        {stat.unit}
                      </span>
                    </div>
                    {stat.change && (
                      <div className="flex items-center gap-1 text-sm">
                        {stat.change > 0 ? (
                          <TrendingUp className="h-3 w-3 text-white" />
                        ) : stat.change < 0 ? (
                          <TrendingDown className="h-3 w-3 text-white" />
                        ) : null}
                        <span
                          className={
                            stat.change > 0
                              ? "text-white"
                              : stat.change < 0
                              ? "text-white"
                              : "text-white"
                          }
                        >
                          {stat.change !== 0 && (stat.change > 0 ? "+" : "")}
                          {stat.change}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <h3
                    className={`font-medium ${
                      index % 2 === 0 ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {stat.title}
                  </h3>
                  {stat.status && (
                    <Badge
                      variant={
                        stat.status === "normal" ? "default" : "destructive"
                      }
                      className={
                        stat.status === "normal"
                          ? "bg-green-100 text-green-800"
                          : ""
                      }
                    >
                      {stat.status === "normal" ? "Normal" : "Attention"}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

      {/* Dialog Form */}
      {/* <Dialog open={!!selectedStat} onOpenChange={() => setSelectedStat(null)}>
        <DialogContent className="max-w-md">
          {selectedStat && (
            <>
              <DialogHeader>
                <DialogTitle>Add {selectedStat.title}</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => handleSubmit(e, selectedStat)}
                className="mt-4 space-y-3"
              >
                {selectedStat.fields.map((field: string, index: number) => {
                  const key = field.toLowerCase();
                  const placeholderText =
                    selectedStat.placeholder && selectedStat.placeholder[index]
                      ? selectedStat.placeholder[index]
                      : `Enter ${field}`;
                  return (
                    <div key={field}>
                      <input
                        type="text"
                        placeholder={placeholderText}
                        value={formData[key] || ""}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className={`w-full border rounded p-2 placeholder:text-sm placeholder:text-gray-400 ${
                          formErrors[key]
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors[key] && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors[key]}
                        </p>
                      )}
                    </div>
                  );
                })}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-400"
                >
                  {loading ? "Saving..." : "Submit"}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default HealthMetrics;

"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchVitalStats } from "@/services/DashboardService";
import api from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { setVitalStats, updateStat } from "@/lib/slices/vitalStatsSlice";
import { RootState } from "@/lib/store";
import MainLayout from "@/components/layout/main-layout";
import MatricsTable from "./MatricsTable";
import { toast } from "@/hooks/use-toast";

const HealthMetrics = () => {
  const dispatch = useDispatch();
  const vitalStats = useSelector((state: any) => state.vitalStats.vitalStats);
  const { user } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<
    Record<string, Record<string, string>>
  >({});
  const [formErrors, setFormErrors] = useState<
    Record<string, Record<string, string>>
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchVitalStats();
        dispatch(setVitalStats(res));

        // Initialize formData for each stat
        const initialFormData: Record<string, Record<string, string>> = {};
        res.forEach((stat: any) => {
          initialFormData[stat.title] = {};
        });
        setFormData(initialFormData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [dispatch]);

  const handleChange = (statTitle: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [statTitle]: { ...prev[statTitle], [field]: value },
    }));

    setFormErrors((prev) => ({
      ...prev,
      [statTitle]: { ...prev[statTitle], [field]: "" },
    }));
  };

  const handleSubmit = async (e: React.FormEvent, stat: any) => {
    e.preventDefault();
    setSaving((prev) => ({ ...prev, [stat.title]: true }));

    const errors: Record<string, string> = {};
    stat.required.forEach((field: string) => {
      const key = field.toLowerCase();
      if (!formData[stat.title]?.[key]) errors[key] = `${field} is required`;
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors((prev) => ({ ...prev, [stat.title]: errors }));
      setSaving((prev) => ({ ...prev, [stat.title]: false }));
      return;
    }

    const payload: Record<string, string> = {};
    Object.entries(formData[stat.title] || {}).forEach(([key, value]) => {
      payload[key.toLowerCase()] = value;
    });

    try {
      const response = await api.post(stat.api, payload);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to save");
      }

      dispatch(updateStat({ title: stat.title, data: response.data.data }));
      setFormErrors((prev) => ({ ...prev, [stat.title]: {} }));
      setFormData((prev) => ({ ...prev, [stat.title]: {} }));

      toast({
        title: `${stat.title} saved successfully! ✅`,
      });
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        Object.entries(error.response.data.errors).forEach(
          ([field, messages]) => {
            apiErrors[field] = (messages as string[])[0];
          }
        );
        setFormErrors((prev) => ({ ...prev, [stat.title]: apiErrors }));
      } else {
        console.error(error);
      }
    } finally {
      setSaving((prev) => ({ ...prev, [stat.title]: false }));
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto mt-10 space-y-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Health Metrics
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {vitalStats.map((stat: any, index: number) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between h-full"
            >
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  {stat.title}
                </h2>
                <form
                  onSubmit={(e) => handleSubmit(e, stat)}
                  className="flex flex-col space-y-4 h-full"
                >
                  {stat.fields.map((field: string, i: number) => {
                    const key = field.toLowerCase();
                    const placeholderText =
                      stat.placeholder && stat.placeholder[i]
                        ? stat.placeholder[i]
                        : `Enter ${field}`;
                    return (
                      <div key={field}>
                        <input
                          type="text"
                          placeholder={placeholderText}
                          value={formData[stat.title]?.[key] || ""}
                          onChange={(e) =>
                            handleChange(stat.title, key, e.target.value)
                          }
                          className={`w-full border rounded p-2 placeholder:text-sm placeholder:text-gray-400 ${
                            formErrors[stat.title]?.[key]
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {formErrors[stat.title]?.[key] && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors[stat.title]?.[key]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </form>
              </div>

              {/* Button stays at bottom */}
              <Button
                type="submit"
                onClick={(e) => handleSubmit(e, stat)}
                disabled={saving[stat.title]}
                className="w-full h-10 bg-blue-600 hover:bg-blue-500 mt-4"
              >
                {saving[stat.title] ? "Saving..." : "Submit"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <MatricsTable />
    </MainLayout>
  );
};

export default HealthMetrics;

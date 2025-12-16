import api from "@/utils/api";

export const fetchAnalyticsGraph = async (payload: { timeRange: string }) => {
  try {
    const res = await api.post("/analytics", payload);
    return res;
  } catch (error) {
    console.error("Error fetching analytics graph:", error);
    throw error;
  }
};


interface AnalyticsPayload {
  test_id: number;
  group_id: number;
  parameter_id: number;
}
export const postAnalytics = async (data: AnalyticsPayload) => {
  try {
    const response = await api.post("analytics/card", data);
    return response;
  } catch (error) {
    console.error("Error posting entry:", error);
    throw error;
  }
};


export const fetchAnalyticsCard = async () => {
  try {
    const response = await api.get("analytics/cards/fetch");
    return response.data;
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};
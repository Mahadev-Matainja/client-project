import api from "@/utils/api";

export const fetchVitalStats = async () => {
  try {
    const response = await api.get("/health/metrics");
    return response.data;
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};

//graph api 
export const fetchDashboardGraph = async () => {
  try {
    const response = await api.get("/dashboard/graph");
    return response.data;
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};
export const fetchMatricsTableData = async () => {
  try {
    const response = await api.get("/health/data");
    return response.data;
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};


// post api

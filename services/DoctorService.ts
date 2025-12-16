import api from "@/utils/api";

export const DoctorCategories = async () => {
  try {
    const response = await api.get("/doctor/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};

//doctor council

export const DoctorCouncil = async () => {
  try {
    const response = await api.get("/doctor/councils");
    return response.data;
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};

//doctor degree
export const DoctorDegree = async () => {
  try {
    const response = await api.get("/doctor/degrees");
    return response.data;
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};

//Doctor search
export const DoctorSerach = async (
  o: string,
  c: string | null,
  q: string | null
) => {
  try {
    const response = await api.post("/doctor/search", {
      o,
      c,
      q,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching doctor data:", error);
    throw error;
  }
};

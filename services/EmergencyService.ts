import api from "@/utils/api";

//Ambulace Details
export const AmbulanceDetails = async (
  state_id: number,
  district_id: number | null,
  city_id: number | null,
  pincode: string | null
) => {
  try {
    const response = await api.post("/ambulance/search", {
      state_id,
      district_id,
      city_id,
      pincode,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching oxygen data:", error);
    throw error;
  }
};

//type of Ambulance
export const AmbulanceType = async () => {
  try {
    const response = await api.get("/ambulance/types");
    return response.data;
  } catch (error) {
    console.error("Error fetching states:", error);
    throw error;
  }
};

// geoloaction api

export const State = async () => {
  try {
    const response = await api.get("/geo/states");
    return response.data;
  } catch (error) {
    console.error("Error fetching states:", error);
    throw error;
  }
};

export const District = async (stateId: number) => {
  try {
    const response = await api.get(`/geo/states/${stateId}/districts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

export const City = async (districtId: number) => {
  try {
    const response = await api.get(`/geo/districts/${districtId}/cities`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

//oxygen

//find oxygen

export const FindOxygen = async (
  state_id: number,
  district_id: number | null,
  city_id: number | null,
  pincode: string | null
) => {
  try {
    const response = await api.post("/oxygen/shops/tree", {
      state_id,
      district_id,
      city_id,
      pincode,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching oxygen data:", error);
    throw error;
  }
};

// ambulanceList

export const fetchAmbulanceList = async () => {
  try {
    const response = await api.get("/ambulances");
    return response.data;
  } catch (error) {
    console.error("Error fetching ambulance list:", error);
    throw error;
  }
};

//ambulance type

export const fetchAmbulanceType = async () => {
  try {
    const response = await api.get("/ambulance/types");
    return response.data;
  } catch (error) {
    console.error("Error fetching Type:", error);
    throw error;
  }
};

//ambulace edit

export const AmbulanceEdit = async (id: number) => {
  try {
    const response = await api.get(`/ambulances/${id}/edit`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Edit:", error);
    throw error;
  }
};

//update ambulance

export const AmbulanceUpdate = async (id: number, formData: FormData) => {
  try {
    const response = await api.post(`/ambulances/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // important for file upload
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating ambulance:", error);
    throw error;
  }
};

//create ambulance

export const AmbulanceCreate = async (formData: FormData) => {
  try {
    const response = await api.post(`/ambulances`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // important for file upload
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating ambulance:", error);
    throw error;
  }
};

//delete ambulance

export const AmbulanceDelete = async (id: number) => {
  try {
    const response = await api.delete(`/ambulances/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting ambulance:", error);
    throw error;
  }
};

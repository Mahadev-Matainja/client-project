import api from "@/utils/api";
import { EntryPayload } from "@/@types/lab-test";

export const fetchTests = async () => {
  try {
    const response = await api.get("/tests");
    return response.data; 
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};


//Select Test

export const selectTest = async (id: string | number) => {
  try {
    const response = await api.get(`/tests/${id}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};

//post api

export const postEntry = async (formData: FormData) => {
  try {
    const response = await api.post("/test/entry", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error posting entry:", error);
    throw error;
  }
};

//single


export const testparameter = async (id: string | number) => {
  try {
    const response = await api.get(`/tests/group/${id}/parameters`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};







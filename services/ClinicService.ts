import api from "@/utils/api";

export const ClinicDoctorList = async () => {
  try {
    const response = await api.get("/clinic/doctors");
    return response.data;
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};

export const ClinicDoctorAdd = async (doctorSearch: string = "") => {
  try {
    const response = await api.get("/clinic/doctors/fetch", {
      params: {
        doctorSearch, // send search term as query param
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

//delete doctor

export const ClinicDoctorDelete = async (rows: number[]) => {
  try {
    const response = await api.delete("/clinic/doctors", {
      data: {
        rows, // 👈 payload here
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting doctors:", error);
    throw error;
  }
};

//doctor add

export const DoctorAdd = async (payload: { doctor_ids: number[] }) => {
  try {
    const response = await api.post("/clinic/doctors/add", payload);
    return response.data; // ✅ important
  } catch (error) {
    console.error("Error doctor add :", error);
    throw error;
  }
};

//shedule fetch

export const sheduleFetch = async (doctor_id: number) => {
  try {
    const response = await api.get(
      `clinic/doctors/${doctor_id}/timetables/fetch`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};

//shedule add

export const SheduleSave = async (doctorId: number, payload: any[]) => {
  try {
    const response = await api.post(
      `/clinic/doctors/${doctorId}/timetables/store`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // 🔴 backend logical validation (conflict etc.)
    if (response.data?.success === false) {
      throw response.data;
    }

    return response.data;
  } catch (error: any) {
    console.error("Schedule save failed:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Something went wrong while saving schedule",
      }
    );
  }
};

//delete shedule

export const DoctorDSheduleDelete = async (
  doctor_id: number,
  rowIds: number[]
) => {
  try {
    const response = await api.delete(
      `clinic/doctors/${doctor_id}/timetables/delete`,
      { data: { rows: rowIds } } // send body in `data`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting doctors:", error);
    throw error;
  }
};

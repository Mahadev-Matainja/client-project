import { ContactFormData } from "@/@types/contact-us";
import api from "@/utils/api";


export const ContactUs = async (data:ContactFormData) => {
  try {
    const response = await api.post("/contacts", data);
    return response;
  } catch (error) {
    console.error("Error posting entry:", error);
    throw error;
  }
};
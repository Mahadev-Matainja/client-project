import { User } from "@/lib/slices/authSlice";

export const mapApiUserToState = (data: User | any) => {
  return {
    id: data.id  || null,
    firstName: data.first_name || data.basic_details?.first_name || "",
    lastName: data.last_name || data.basic_details?.last_name || "",
    email: data.email || "",
    avatar: data.avatar ||data.basic_details?.avatar|| "",
  };
};
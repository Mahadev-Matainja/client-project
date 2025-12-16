import { AppDispatch } from "@/lib/store";
// import { setUser } from "@/lib/slices/authSlice";
import { setAuth, setAuthUpdate } from "@/lib/slices/authSlice";
import api from "@/utils/api";
import { mapApiUserToState } from "@/utils/userMapper";
import { useDispatch } from "react-redux";

// Fetch profile
export const fetchProfile = () => async (dispatch: AppDispatch) => {
  try {
    const response = await api.get("/profile/show");
    const profile = response.data;
    return profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

// Update profile
export const submitProfileUpdate = async (data: any, dispatch: AppDispatch) => {
  try {
    const response = await api.post("/profile/update", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const updatedUser = response.data;
    // Use mapping to ensure state shape consistency
    // const mappedUser = mapApiUserToState(updatedUser.data.customer);
    const { customer, token } = updatedUser?.data;
    dispatch(setAuthUpdate({ user: customer, token }));
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

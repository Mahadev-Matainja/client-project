import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile?: string;
  dob?: string;
  gender?: string;
  type?: string;
  subType?: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
}
interface AuthState {
  user: User | null;
  token: string | null;
}
const initialState: AuthState = { user: null, token: null };
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setAuthUpdate(state, action: PayloadAction<{ user: User; token: string }>) {
      if (state.user !== null) {
        state.user.first_name = action.payload.user.first_name || "";
        state.user.last_name = action.payload.user.last_name || "";
      }
      // state.token = action.payload.token;
    },
    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
});
export const { setAuth, setAuthUpdate, logout } = authSlice.actions;
export default authSlice.reducer;

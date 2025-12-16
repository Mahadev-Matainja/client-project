import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  firstName:string;
  lastName:string;
  image: string;
}

const initialState: UserState = {
  firstName: "",
  lastName:"",
  image: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.firstName = action.payload.firstName;
      state.lastName=action.payload.lastName;
      state.image = action.payload.image;
    },
    updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
      if (action.payload.firstName) state.firstName = action.payload.firstName;
      if (action.payload.lastName) state.lastName = action.payload.lastName;
      if (action.payload.image) state.image = action.payload.image;
    },
  },
});

export const { setUser, updateUser } = userSlice.actions;
export default userSlice.reducer;

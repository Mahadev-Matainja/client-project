import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Doctor {
  id: number;
  name: string;
  image: string;
  specialist: string;
  priority: number | null;
  status: string;
  qualification: string;
}

interface DoctorsState {
  list: Doctor[];
}

const initialState: DoctorsState = {
  list: [],
};

const clinicDoctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    addDoctors: (state, action: PayloadAction<Doctor[]>) => {
      // append new doctors
      state.list.push(...action.payload);
    },
  },
});

export const { addDoctors } = clinicDoctorsSlice.actions;
export default clinicDoctorsSlice.reducer;

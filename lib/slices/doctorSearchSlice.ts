import { createSlice } from "@reduxjs/toolkit";

const doctorSearchSlice = createSlice({
  name: "doctorSearch",
  initialState: {
    selectedOption: "Doctor",
    searchText: "",
    selectedCategoryId: null, 
  },
  reducers: {
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },

    setSelectedCategoryId: (state, action) => {
      state.selectedCategoryId = action.payload;
    },
  },
});

export const { setSelectedOption, setSearchText, setSelectedCategoryId } =
  doctorSearchSlice.actions;

export default doctorSearchSlice.reducer;

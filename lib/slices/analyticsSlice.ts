import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Card {
  name: string;
  groupName: string;
  value: string;
  unit: string;
  normal_range: string;
  status: string;
  priority: number;
}

interface AnalyticsState {
  metrics: Card[];
}

const initialState: AnalyticsState = {
  metrics: [],
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setMetrics: (state, action: PayloadAction<Card[]>) => {
      // ✅ Sort before saving
      state.metrics = action.payload.sort((a, b) => a.priority - b.priority);
    },
   
  },
});

export const { setMetrics} = analyticsSlice.actions;
export default analyticsSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VitalStatState {
  vitalStats: any[];
}

const initialState: VitalStatState = {
  vitalStats: [],
};

const vitalStatsSlice = createSlice({
  name: "vitalStats",
  initialState,
  reducers: {
    setVitalStats: (state, action: PayloadAction<any[]>) => {
      state.vitalStats = action.payload;
    },
    updateStat: (state, action: PayloadAction<{ title: string; data: any }>) => {
      const { title, data } = action.payload;
      const index = state.vitalStats.findIndex((s) => s.title === title);

      if (index !== -1) {
        let newValue: string | number = "";

        //  Handle Blood Pressure
        if (data.systolic && data.diastolic) {
          newValue = `${data.systolic}/${data.diastolic}`;
          // if (data.pulse) {
          //   newValue += ` (Pulse ${data.pulse})`;
          // }
        }
        //  Handle Heart Rate
        else if (data.bpm) {
          newValue = data.bpm;
        }
        //  Handle Blood Sugar
        else if (data.value && data.context) {
          newValue = `${data.value} (${data.context})`;
        }
        //  Handle Temperature
        else if (data.value && data.method) {
          newValue = `${data.value}`;
        }
        //  Fallback (show value only)
        else if (data.value) {
          newValue = data.value;
        }

        state.vitalStats[index] = {
          ...state.vitalStats[index],
          value: newValue,
          status: data.status || state.vitalStats[index].status,
          date: data.measured_at || new Date().toISOString(),
          change: data.change || state.vitalStats[index].change || 0, 
        };
      }
    },
  },
});

export const { setVitalStats, updateStat } = vitalStatsSlice.actions;
export default vitalStatsSlice.reducer;

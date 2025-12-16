import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Subscription = {
  serial_no: number;
  plan_name: string;
  start_date: string | null;
  end_date: string | null;
  validity: string | null;
  status: number | null;
  id: number;
};

interface SubscriptionState {
  data: Subscription[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  data: [],
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSubscriptions: (state, action: PayloadAction<Subscription[]>) => {
      state.data = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setSubscriptions, setError } =
  subscriptionSlice.actions;
export default subscriptionSlice.reducer;

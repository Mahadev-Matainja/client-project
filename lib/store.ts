import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./slices/authSlice";
import vitalStatsReducer from "./slices/vitalStatsSlice";
import analyticsReducer from "./slices/analyticsSlice";
import subscriptionReducer from "./slices/activeSubscriptionSlice";
import doctorSearchReducer from "./slices/doctorSearchSlice";
import signupReducer from "./slices/signupSlice"
const rootReducer = combineReducers({
  auth: authReducer,
  vitalStats: vitalStatsReducer,
  analytics: analyticsReducer,
  subscription: subscriptionReducer,
  doctorSearch: doctorSearchReducer,
  signup:signupReducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // persist only auth slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

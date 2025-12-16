// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface SignupState {
//   basicInfo: Record<string, any>;
//   accountSecurity: Record<string, any>;
//   patientHealthInfo: Record<string, any>;
//   healthGoals: Record<string, any>;
// }

// const initialState: SignupState = {
//   basicInfo: {},
//   accountSecurity: {},
//   patientHealthInfo: {},
//   healthGoals: {},
// };

// const signupSlice = createSlice({
//   name: "signup",
//   initialState,
//   reducers: {
//     saveBasicInfo(state, action: PayloadAction<any>) {
//       state.basicInfo = action.payload;
//     },
//     saveAccountSecurity(state, action: PayloadAction<any>) {
//       state.accountSecurity = action.payload;
//     },
//     savePatientHealthInfo(state, action: PayloadAction<any>) {
//       state.patientHealthInfo = action.payload;
//     },
//     saveHealthGoals(state, action: PayloadAction<any>) {
//       state.healthGoals = action.payload;
//     },

//     resetSignup() {
//       return initialState;
//     },
//   },
// });

// export const {
//   saveBasicInfo,
//   saveAccountSecurity,
//   savePatientHealthInfo,
//   saveHealthGoals,
//   resetSignup,
// } = signupSlice.actions;

// export default signupSlice.reducer;

// signupSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserType = "patient" | "oxygen" | "ambulance" | "clinic" | null;

interface SignupState {
  userType: UserType;
  patient: {
    personal: Record<string, any>;
    account: Record<string, any>;
    health: Record<string, any>;
    goal: Record<string, any>;
  };
  singleStep?: Record<string, any>;
}

const initialState: SignupState = {
  userType: "patient",
  patient: {
    personal: {},
    account: {},
    health: {},
    goal: { goals: [], notes: "", termsAccepted: false },
  },
  singleStep: {},
};

const slice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    setUserType(state, action: PayloadAction<UserType>) {
      state.userType = action.payload;
    },
    updatePersonal(state, action: PayloadAction<Record<string, any>>) {
      state.patient.personal = { ...state.patient.personal, ...action.payload };
    },
    updateAccount(state, action: PayloadAction<Record<string, any>>) {
      state.patient.account = { ...state.patient.account, ...action.payload };
    },
    updateHealth(state, action: PayloadAction<Record<string, any>>) {
      state.patient.health = { ...state.patient.health, ...action.payload };
    },
    updateGoal(state, action: PayloadAction<Record<string, any>>) {
      state.patient.goal = { ...state.patient.goal, ...action.payload };
    },
    updateSingleStep(state, action: PayloadAction<Record<string, any>>) {
      state.singleStep = { ...state.singleStep, ...action.payload };
    },
    resetSignup() {
      return initialState;
    },
  },
});

export const {
  setUserType,
  updatePersonal,
  updateAccount,
  updateHealth,
  updateGoal,
  updateSingleStep,
  resetSignup,
} = slice.actions;

export default slice.reducer;

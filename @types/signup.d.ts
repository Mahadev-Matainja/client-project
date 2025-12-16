import type { UserTypeKey } from "@/config/signupConfig";

export type BasicInfo = {
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  mobile?: string;
  userType?: UserTypeKey | ""; // typed to keys of signupConfig or empty
  subType?: string;
  gender?: string;
};

export type AccountSecurity = {
  password?: string;
  confirmPassword?: string;
};

export type PatientHealthInfo = {
  ChronicDisease?: string;
  diseaseList?: string[];
  medications?: string;
  allergies?: string;
  EmergencyName?: string;
  EmergencyPhone?: string;
};

export type HealthGoals = {
  goals?: string[];
  preferences?: string[];
  termsAccepted?: boolean;
  privacyAccepted?: boolean;
};

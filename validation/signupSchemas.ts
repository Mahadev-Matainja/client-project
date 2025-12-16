// signupSchemas.ts

export type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  mobile: string;
  userType: string;
  subType: string;
  gender: string;
  password?: string;
  confirmPassword?: string;
  ChronicDisease?: string;
  diseaseList?: string[];
  EmergencyName?: string;
  EmergencyPhone?: string;
  termsAccepted?: boolean; // boolean only
  privacyAccepted?: boolean;
};

export type ValidationErrors = { [key: string]: string };

/**
 * validateStep: Validate a step of the multi-step signup form
 */
export const validateStep = (
  step: number,
  formData: FormData,
  basicInfo: FormData,
  emailStatus: "valid" | "invalid" | "" = "",
  mobileStatus: "valid" | "invalid" | "" = ""
): ValidationErrors => {
  const newErrors: ValidationErrors = {};

  // determine if terms/privacy should be shown
  const noTermsList = [{ userType: "customer", subType: "patient" }];
  const showTerms = !noTermsList.some(
    (u) => u.userType === formData.userType && u.subType === formData.subType
  );

  switch (step) {
    // -------------------------------
    // STEP 1 — BASIC INFO
    // -------------------------------
    case 1:
      if (!formData.firstName?.trim())
        newErrors.firstName = "First name is required";

      if (!formData.lastName?.trim())
        newErrors.lastName = "Last name is required";

      if (!formData.email?.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      } else if (emailStatus === "invalid") {
        newErrors.email = "Email already registered";
      }

      if (!formData.mobile?.trim()) {
        newErrors.mobile_no = "Mobile number is required";
      } else if (!/^\d{10}$/.test(formData.mobile)) {
        newErrors.mobile_no = "Must be 10 digits";
      } else if (mobileStatus === "invalid") {
        newErrors.mobile_no = "Mobile already registered";
      }

      if (!formData.dob) newErrors.dob = "Date of birth is required";

      if (!formData.gender) newErrors.gender = "Gender is required";

      if (!formData.userType) newErrors.userType = "User type is required";

      if (!formData.subType) newErrors.subType = "Sub-type is required";

      break;

    // -------------------------------
    // STEP 2 — PASSWORD + TERMS
    // -------------------------------
    case 2:
      if (!formData.password?.trim())
        newErrors.password = "Password is required";

      if (!formData.confirmPassword?.trim()) {
        newErrors.confirmPassword = "Confirm password is required";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      // show terms only if NOT patient
      const isPatient =
        basicInfo?.userType === "customer" && basicInfo?.subType === "patient";

      if (!isPatient) {
        if (!formData.termsAccepted)
          newErrors.termsAccepted = "You must accept Terms & Conditions";

        if (!formData.privacyAccepted)
          newErrors.privacyAccepted = "You must accept Privacy Policy";
      }

      break;

    // -------------------------------
    // STEP 3 — MEDICAL + EMERGENCY CONTACT
    // -------------------------------
    case 3:
      if (!formData.ChronicDisease)
        newErrors.ChronicDisease = "Please select Yes or No";

      if (
        formData.ChronicDisease === "yes" &&
        (!formData.ChronicDisease || formData.ChronicDisease.length === 0)
      )
        newErrors.ChronicDisease = "Please select at least one condition";

      if (!formData.EmergencyName?.trim())
        newErrors.EmergencyName = "Emergency name is required";

      if (!formData.EmergencyPhone?.trim())
        newErrors.EmergencyPhone = "Emergency phone is required";

      break;

    // -------------------------------
    // STEP 4 — FINAL CONFIRMATION
    // -------------------------------
    case 4:
      if (!formData.termsAccepted)
        newErrors.termsAccepted = "You must accept the terms and conditions";

      if (!formData.privacyAccepted)
        newErrors.privacyAccepted = "You must accept the privacy policy";

      break;
  }

  return newErrors;
};

// validation.ts
export function validatePersonal(vals: any) {
  const errors: Record<string, string> = {};

  if (!vals.firstName?.trim()) errors.firstName = "First name is required";
  if (!vals.lastName?.trim()) errors.lastName = "Last name is required";

  if (!vals.email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email))
    errors.email = "Invalid email";

  // DOB REQUIRED
  if (!vals.dob) {
    errors.dob = "Date of birth is required";
  } else {
    const selectedDate = new Date(vals.dob);
    const today = new Date();

    // remove time part for accurate comparison
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      errors.dob = "Date of birth cannot be in the future";
    }
  }

  // MOBILE
  if (!vals.mobile) errors.mobile = "Mobile is required";
  else if (!/^[0-9]{10}$/.test(vals.mobile))
    errors.mobile = "Mobile must be 10 digits";

  // GENDER
  if (!vals.gender) errors.gender = "Gender is required";

  return errors;
}

export function validateAccount(vals: any) {
  const errors: Record<string, string> = {};

  const password = vals.password;

  // PASSWORD REQUIRED
  if (!password) {
    errors.password = "Password is required";
  } else {
    // REGEX RULES
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!hasUpper) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!hasLower) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!hasNumber) {
      errors.password = "Password must contain at least one number";
    }
  }

  // CONFIRM PASSWORD
  if (!vals.confirmPassword) {
    errors.confirmPassword = "Please confirm password";
  } else if (vals.password !== vals.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export function validateHealth(vals: any) {
  const errors: Record<string, string> = {};

  // Chronic disease selection
  if (!vals.ChronicDisease) {
    errors.ChronicDisease = "Please select Yes or No";
  }

  // If YES → disease list required
  if (vals.ChronicDisease === "yes" && vals.diseaseList.length === 0) {
    errors.diseaseList = "Select at least one chronic condition";
  }

  // Emergency contact name
  if (!vals.EmergencyName?.trim()) {
    errors.EmergencyName = "Emergency contact name is required";
  }

  // Emergency contact phone
  if (!vals.EmergencyPhone?.trim()) {
    errors.EmergencyPhone = "Emergency contact phone is required";
  } else if (!/^[0-9]{10}$/.test(vals.EmergencyPhone)) {
    errors.EmergencyPhone = "Phone must be 10 digits";
  }

  return errors;
}

export function validateGoal(vals: any) {
  const errors: Record<string, string> = {};
  // if (!Array.isArray(vals.goals) || vals.goals.length === 0)
  //   errors.goals = "Choose at least one goal";
  if (!vals.termsAccepted)
    errors.termsAccepted = "You must accept terms and conditions";

  if (!vals.privacyAccepted)
    errors.privacyAccepted = "You must accept privacy policy";
  return errors;
}

export function validateSingleStep(vals: any, role?: string) {
  const errors: Record<string, string> = {};
  if (
    role == "doctor" ||
    role === "dietitian" ||
    role === "sample_collector" ||
    role === "physiotherapist"
  ) {
    if (!vals.fname || !vals.fname.trim()) errors.fname = "First name required";
    if (!vals.lname || !vals.lname.trim()) errors.lname = "Last name required";
    if (!vals.specialist || !vals.specialist.trim())
      errors.specialist = "Specialist required";
  } else {
    if (!vals.name || !vals.name.trim()) errors.name = "Name required";
  }
  if (!vals.email) errors.email = "Email required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email))
    errors.email = "Invalid email";
  if (!vals.mobile) errors.mobile = "Mobile required";
  else if (!/^[0-9]{10}$/.test(vals.mobile))
    errors.mobile = "Mobile must be 10 digits";
  if (!vals.password) errors.password = "Password required";
  else if (vals.password.length < 6)
    errors.password = "Password must be at least 6 characters";
  if (!vals.confirm) errors.confirm = "Confirm password";
  else if (vals.password !== vals.confirm)
    errors.confirm = "Passwords do not match";
  if (!vals.terms) errors.terms = "Accept terms to continue";
  if (!vals.policy) errors.policy = "Accept policy to continue";
  return errors;
}

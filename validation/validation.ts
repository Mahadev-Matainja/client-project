// validation.ts
export function validatePersonal(vals: any) {
  const errors: Record<string, string> = {};
  if (!vals.firstname?.trim()) errors.firstname = "First name is required";
  if (!vals.lastname?.trim()) errors.lastname = "Last name is required";
  if (!vals.email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email))
    errors.email = "Invalid email";
  if (!vals.dob) errors.dob = "Date of birth is required";
  if (!vals.mobile) errors.mobile = "Mobile is required";
  else if (!/^[0-9]{10}$/.test(vals.mobile))
    errors.mobile = "Mobile must be 10 digits";
  if (!vals.gender) errors.gender = "Gender is required";
  return errors;
}

export function validateAccount(vals: any) {
  const errors: Record<string, string> = {};
  if (!vals.password) errors.password = "Password is required";
  else if (vals.password.length < 6)
    errors.password = "Password must be >= 6 chars";
  if (!vals.confirm) errors.confirm = "Please confirm password";
  else if (vals.password !== vals.confirm)
    errors.confirm = "Passwords do not match";
  return errors;
}

export function validateHealth(vals: any) {
  const errors: Record<string, string> = {};
  if (!vals.height) errors.height = "Height is required";
  if (!vals.weight) errors.weight = "Weight is required";
  if (!vals.bloodGroup) errors.bloodGroup = "Blood group is required";
  return errors;
}

export function validateGoal(vals: any) {
  const errors: Record<string, string> = {};
  if (!Array.isArray(vals.goals) || vals.goals.length === 0)
    errors.goals = "Choose at least one goal";
  if (!vals.termsAccepted)
    errors.termsAccepted = "You must accept terms and conditions";
  return errors;
}

export function validateSingleStep(vals: any) {
  const errors: Record<string, string> = {};
  if (!vals.name || !vals.name.trim()) errors.name = "Name required";
  if (!vals.email) errors.email = "Email required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email))
    errors.email = "Invalid email";
  if (!vals.mobile) errors.mobile = "Mobile required";
  else if (!/^[0-9]{10}$/.test(vals.mobile))
    errors.mobile = "Mobile must be 10 digits";
  if (!vals.password) errors.password = "Password required";
  else if (vals.password.length < 6)
    errors.password = "Password must be >=6 chars";
  if (!vals.confirm) errors.confirm = "Confirm password";
  else if (vals.password !== vals.confirm)
    errors.confirm = "Passwords do not match";
  if (!vals.terms) errors.terms = "Accept terms to continue";
  return errors;
}

export const validatePersonalInfo = (
  personalInfo: any,
  setErrors: (errors: Record<string, string>) => void
) => {
  const newErrors: Record<string, string> = {};

  // Basic fields
  if (!personalInfo.firstName?.trim())
    newErrors.firstName = "First name is required";

  if (!personalInfo.gender?.trim()) newErrors.gender = "Gender is required";

  if (!personalInfo.availabilityStatus?.trim())
    newErrors.availabilityStatus = "Availability status is required";

  // Qualification (must be array)
  if (
    !Array.isArray(personalInfo.qualification) ||
    personalInfo.qualification.length === 0
  ) {
    newErrors.qualification = "Qualification is required";
  }

  // Specialization
  if (!personalInfo.specialization) {
    newErrors.specialization = "Specialization is required";
  }

  // Registration fields (correct keys)
  if (!personalInfo.registration?.medicalCouncil) {
    newErrors.medicalCouncil = "Medical council is required";
  }

  if (!personalInfo.registration?.registrationNumber?.trim()) {
    newErrors.registrationNumber = "Registration number is required";
  }

  if (!personalInfo.registration?.year_of_passing?.trim()) {
    newErrors.year_of_passing = "Year of passing is required";
  }

  if (!personalInfo.registration?.month_of_passing?.trim()) {
    newErrors.month_of_passing = "Month of passing is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

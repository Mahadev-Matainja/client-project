// /validation/ambulanceValidation.ts

export interface AmbulanceFormData {
  [key: string]: any;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateAmbulanceForm = (
  formData: AmbulanceFormData
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Phone validation
  if (!formData.reg_phone) {
    errors.reg_phone = "Primary phone is required";
  } else if (!/^[6-9]\d{9}$/.test(formData.reg_phone)) {
    errors.reg_phone =
      "Primary phone must be a valid 10-digit number starting 6-9";
  }

  if (formData.alternative_phone) {
    if (!/^[6-9]\d{9}$/.test(formData.alternative_phone)) {
      errors.alternative_phone = "Alternative phone must be valid 10-digit";
    } else if (formData.alternative_phone === formData.reg_phone) {
      errors.alternative_phone =
        "Alternative phone must be different from primary";
    }
  }

  // Address validation
  if (!formData.address_line1?.trim()) {
    errors.address_line1 = "Address is required";
  }

  // Pincode validation
  if (!formData.pincode) {
    errors.pincode = "Pincode is required";
  } else if (!/^\d{6}$/.test(formData.pincode)) {
    errors.pincode = "Pincode must be exactly 6 digits";
  }

  // Ambulance type validation
  if (!formData.ambulance_typeId) {
    errors.ambulance_typeId = "Please select ambulance type";
  }

  return errors;
};

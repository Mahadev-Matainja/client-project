// utils/uniqueCheck.ts
import api from "@/utils/api";

export interface UniqueCheckResult {
  emailAvailable: boolean;
  mobileAvailable: boolean;
  emailMessage?: string;
  mobileMessage?: string;
}

export async function checkUnique(
  email: string,
  mobile_no: string,
  role?: string
): Promise<UniqueCheckResult> {
  try {
    // Special roles
    const specialRoles = [
      "doctor",
      "dietitian",
      "sample_collector",
      "physiotherapist",
    ];

    // Choose endpoint based on role
    let endpoint = "/unique/check";

    if (role) {
      endpoint = specialRoles.includes(role)
        ? "/doctor/unique/check"
        : "/unique/check";
    }

    const res = await api.get(endpoint, {
      params: { email, mobile_no },
    });

    const data = res.data;

    return {
      emailAvailable: data.email?.available ?? true,
      mobileAvailable: data.mobile_no?.available ?? true,
      emailMessage: data.email?.message,
      mobileMessage: data.mobile_no?.message,
    };
  } catch (err) {
    console.error("Unique check error:", err);
    return {
      emailAvailable: true,
      mobileAvailable: true,
    };
  }
}

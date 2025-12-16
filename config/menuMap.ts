import {
  Activity,
  User,
  FileText,
  TrendingUp,
  Search,
  Ambulance,
  Crown,
  BriefcaseMedical,
} from "lucide-react";

export const menuMap = {
  // ============================
  // CUSTOMER ROLES
  // ============================
  customer: {
    ambulance: [
      {
        label: "Overview",
        path: "/ambulance/dashboard",
        icon: Activity,
      },
      {
        label: "Profile",
        path: "/ambulance/profile",
        icon: User,
      },
      {
        label: "Ambulance List",
        path: "/ambulance/list",
        icon: Ambulance,
      },
      // {
      //   label: "Add Ambulance",
      //   path: "/ambulance/addAmbulace",
      //   icon: Ambulance,
      // },
    ],

    oxygen: [
      {
        label: "Overview",
        path: "/oxygen/dashboard",
        icon: Activity,
      },
      {
        label: "Profile",
        path: "/oxygen/profile",
        icon: User,
      },
      {
        label: "Add Oxygen",
        path: "",
        icon: Ambulance,
      },
    ],

    clinic: [
      {
        label: "Overview",
        path: "/clinic/dashboard",
        icon: Activity,
      },
      {
        label: "Profile",
        path: "/clinic/profile",
        icon: User,
      },
    ],

    // =========================
    // PATIENT
    // =========================
    patient: [
      {
        label: "Overview",
        path: "/dashboard",
        icon: Activity,
      },
      {
        label: "Profile",
        path: "/profile",
        icon: User,
      },
      {
        label: "Report Entry",
        path: "/lab-entry",
        icon: FileText,
      },
      {
        label: "Health Matrix",
        path: "/health-matrics",
        icon: FileText,
      },
      {
        label: "Single Report Entry",
        path: "/single-report-entry",
        icon: FileText,
      },
      {
        label: "Report Records",
        path: "/test-records",
        icon: FileText,
      },
      {
        label: "Report Compare",
        path: "/test-compare",
        icon: FileText,
      },
      {
        label: "Reports",
        path: "/reports",
        icon: FileText,
      },
      {
        label: "Analytics",
        path: "/analytics",
        icon: TrendingUp,
      },
      {
        label: "Emergency Services",
        path: "/emergency",
        icon: Ambulance,
      },
      {
        label: "Subscription",
        path: "/subscription",
        icon: Crown,
      },
      {
        label: "Subscription History",
        path: "/subscription-history",
        icon: Crown,
      },
      {
        label: "Active Subscription",
        path: "/active-subscription",
        icon: Crown,
      },
      {
        label: "Doctor Search",
        path: "/search-doctor",
        icon: Search,
      },
    ],
  },

  // ============================
  // DOCTOR ROLE
  // ============================
  doctor: {
    doctor: [
      {
        label: "Overview",
        path: "/doctor/dashboard",
        icon: Activity,
      },
      {
        label: "Profile",
        path: "/doctor/profile",
        icon: User,
      },
    ],
    dietitian: [
      {
        label: "Overview",
        path: "/doctor/dashboard",
        icon: Activity,
      },
      {
        label: "Profile",
        path: "/doctor/profile",
        icon: User,
      },
    ],
    sample_collector: [
      {
        label: "Overview",
        path: "/doctor/dashboard",
        icon: Activity,
      },
      {
        label: "Profile",
        path: "/doctor/profile",
        icon: User,
      },
    ],
    physiotherapist: [
      {
        label: "Overview",
        path: "/doctor/dashboard",
        icon: Activity,
      },
      {
        label: "Profile",
        path: "/doctor/profile",
        icon: User,
      },
    ],
  },
};

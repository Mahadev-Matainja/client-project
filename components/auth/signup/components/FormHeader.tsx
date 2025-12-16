import React from "react";
import { User, Lock, Heart, UserCheck } from "lucide-react";

export default function FormHeader({
  step,
  type,
}: {
  step?: number;
  type?: string;
}) {
  /** PATIENT ICONS */
  const stepIcons = [
    <User size={42} />,
    <Lock size={42} />,
    <Heart size={42} />,
    <UserCheck size={42} />,
  ];

  /** COLORS per step (1→4) */
  const bgColors = [
    "bg-blue-100",
    "bg-green-100",
    "bg-red-100",
    "bg-purple-100",
  ];
  const iconColors = [
    "text-blue-600",
    "text-green-600",
    "text-red-600",
    "text-purple-600",
  ];

  /** PATIENT TITLES */
  const titles = [
    "Personal Information",
    "Account Information",
    "Patient Health Information",
    "Health Goal",
  ];

  const subtitles = [
    "Let's start with your basic details",
    "Secure your login and contact details",
    "Tell us about your medical background",
    "Set your health goals for better care",
  ];

  /** OTHER ROLES — SINGLE STEP */
  const singleTitles: Record<string, string> = {
    oxygen: "Oxygen Provider Signup",
    ambulance: "Ambulance Registration",
    clinic: "Clinic Registration",
    doctor: "Doctor Registration",
    dietitian: "Dietitian Registration",
    "sample collector": "Sample collector Registration",
    physiotherapist: "Physiotherapist Registration",
  };

  const singleSubtitles: Record<string, string> = {
    oxygen: "Provide your basic business information",
    ambulance: "Register your ambulance service details",
    clinic: "Register your clinic's information",
    doctor: "Register your doctor's information",
    dietitian: "Register your dietitian's information",
    "sample collector": "Register your sample collector's information",
    physiotherapist: "Register your physiotherapist's information",
  };

  /** ROLE ≠ PATIENT */
  if (type && type !== "patient") {
    return (
      <div className="mb-6 text-center">
        <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold">{singleTitles[type]}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {singleSubtitles[type]}
        </p>
      </div>
    );
  }

  /** PATIENT HEADER */
  const currentIndex = (step || 1) - 1;

  return (
    <div className="mb-6 text-center">
      {/* Dynamic Icon / Background / Color */}
      <div
        className={`${bgColors[currentIndex]} rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center`}
      >
        {React.cloneElement(
          stepIcons[currentIndex] as React.ReactElement<any>,
          {
            className: `h-8 w-8 ${iconColors[currentIndex]}`,
          }
        )}
      </div>

      <h3 className="text-lg font-semibold">{titles[currentIndex]}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {subtitles[currentIndex]}
      </p>
    </div>
  );
}

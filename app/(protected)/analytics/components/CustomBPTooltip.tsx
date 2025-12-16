import React from "react";

interface CustomBPTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomBPTooltip: React.FC<CustomBPTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    // find systolic first, diastolic second
    const systolic = payload.find((p) => p.dataKey === "systolic");
    const diastolic = payload.find((p) => p.dataKey === "diastolic");

    return (
      <div className="bg-white border rounded-md shadow-md p-4 text-sm">
        <p className="font-medium mb-1">{label}</p>
        {systolic && (
          <p className="text-red-500">
            Systolic: <span className="font-semibold">{systolic.value}</span>
          </p>
        )}
        {diastolic && (
          <p className="text-blue-500 mt-1">
            Diastolic: <span className="font-semibold">{diastolic.value}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default CustomBPTooltip;

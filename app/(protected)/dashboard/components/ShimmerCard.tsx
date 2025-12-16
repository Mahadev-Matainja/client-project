import React from "react";

const ShimmerCard = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-64 bg-gray-100 rounded"></div>
    </div>
  );
};

export default ShimmerCard;

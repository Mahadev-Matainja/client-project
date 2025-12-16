const ShimmerDoctorCard = () => {
  return (
    <div className="bg-white rounded-xl p-5 flex items-center shadow-sm animate-pulse">
      <div className="w-20 h-20 rounded-full bg-gray-300"></div>

      <div className="ml-4 flex-1">
        <div className="h-4 bg-gray-300 rounded w-32 mb-3"></div>
        <div className="h-3 bg-gray-300 rounded w-20 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
  );
};

export default ShimmerDoctorCard;

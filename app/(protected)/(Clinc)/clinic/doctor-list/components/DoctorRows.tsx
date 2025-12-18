import { Pencil, Trash2 } from "lucide-react";
import { Doctor } from "@/@types/doctor";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DoctorRowProps {
  doctor: Doctor;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function DoctorRow({
  doctor,
  index,
  onEdit,
  onDelete,
}: DoctorRowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online":
        return "bg-green-100 text-green-700 border-green-200";
      case "Offline":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-300 last:border-0 text-center">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium border-r border-gray-300">
        {index + 1}
      </td>

      <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300 ">
        <div className="flex justify-center">
          <Avatar className="h-15 w-15 border border-gray-300">
            {doctor.image ? (
              <AvatarImage
                src={doctor.image}
                alt={doctor.name}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-blue-100 text-blue-800">
                {getInitials(doctor.name)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-300">
        <div className="font-medium text-gray-900">{doctor.name}</div>
        <div className="text-xs text-gray-500 max-w-xs truncate mt-2">
          {doctor.qualification || "Not specified"}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-300">
        <div className="text-sm text-gray-700">{doctor.specialist}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-300">
        {doctor.priority}
      </td>

      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-300">
        <Badge
          className={`${getStatusColor(
            doctor.status
          )} font-medium px-3 py-1 rounded-full`}
        >
          {doctor.status}
        </Badge>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow border border-blue-100 cursor-pointer"
            title="Edit Doctor"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow border border-red-100 cursor-pointer"
            title="Delete Doctor"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

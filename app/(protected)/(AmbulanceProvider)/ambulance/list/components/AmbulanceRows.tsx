import { Pencil, Trash2 } from "lucide-react";
import { AmbulanceList } from "@/@types/ambulance";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

interface AmbulanceRowProps {
  item: AmbulanceList;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AmbulanceRow({
  item,
  index,
  onEdit,
  onDelete,
}: AmbulanceRowProps) {
  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace("/api", "") || "";

  const normalizeUrl = (base: string, path: string) => {
    return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
  };

  const imageUrl = item.image
    ? normalizeUrl(BASE_URL, item.image)
    : "/ambulace.png";

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-0">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-medium border border-gray-300">
        {index + 1}
      </td>
      <td className="px-2 py-2 whitespace-nowrap border border-gray-300">
        <div className="h-16 w-16">
          <Image
            src={imageUrl}
            alt="Ambulance"
            width={56}
            height={56}
            className="h-14 w-14 p-1.5 object-cover"
          />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
        <div>
          <div className="text-sm font-semibold text-gray-900">{item.name}</div>
          <Badge className="mt-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm">
            #{item.ambulance_no}
          </Badge>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium border border-gray-300">
        {item.type}
      </td>
      <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
        <div className="text-sm font-medium text-gray-900">{item.phone}</div>
        {item.alt_phone && (
          <div className="text-xs text-gray-500 mt-1 font-medium">
            {item.alt_phone}
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate font-medium border border-gray-300">
        {item.address}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium border border-gray-300">
        {item.vehicle}
      </td>
      <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
        {item.availability ? (
          <Badge className="bg-green-50 text-green-700 border border-green-200 font-semibold px-3 py-1 rounded-full shadow-sm">
            Available
          </Badge>
        ) : (
          <Badge className="bg-red-50 text-red-700 border border-red-200 font-semibold px-3 py-1 rounded-full shadow-sm">
            Not Available
          </Badge>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
        {item.verified ? (
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-semibold px-3 py-1 rounded-full shadow-sm">
            Verified
          </Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-700 border border-gray-300 font-semibold px-3 py-1 rounded-full shadow-sm">
            Not Verified
          </Badge>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
        {item.status ? (
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-semibold px-3 py-1 rounded-full shadow-sm">
            Active
          </Badge>
        ) : (
          <Badge className="bg-gray-100 text-gray-700 border border-gray-300 font-semibold px-3 py-1 rounded-full shadow-sm">
            Inactive
          </Badge>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap border border-gray-300">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow border border-blue-100 cursor-pointer"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow border border-red-100 cursor-pointer"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

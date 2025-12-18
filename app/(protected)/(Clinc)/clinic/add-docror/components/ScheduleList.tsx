"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Calendar } from "lucide-react";
import { Trash2 } from "lucide-react";

interface ScheduleListProps {
  availability: any[];
  setAvailability: React.Dispatch<React.SetStateAction<any[]>>;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({
  availability,
  setAvailability,
}) => {
  const handleRemoveSchedule = (id: number) => {
    setAvailability(availability.filter((item) => item.id !== id));
  };

  if (availability.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg bg-gray-50">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No schedule added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {availability.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">{item.day}</p>
              <p className="text-sm text-gray-500">
                {item.from} - {item.to}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveSchedule(item.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 cursor-pointer" />
          </Button>
        </div>
      ))}
    </div>
  );
};

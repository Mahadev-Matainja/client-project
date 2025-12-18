"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface NewScheduleFormProps {
  availability: any[];
  setAvailability: React.Dispatch<React.SetStateAction<any[]>>;
}

export const NewScheduleForm: React.FC<NewScheduleFormProps> = ({
  availability,
  setAvailability,
}) => {
  const [newSchedule, setNewSchedule] = useState({
    day: "",
    from: "09:00",
    to: "17:00",
  });

  const handleAddSchedule = () => {
    if (!newSchedule.day) return;
    setAvailability([...availability, { ...newSchedule, id: Date.now() }]);
    setNewSchedule({ day: "", from: "09:00", to: "17:00" });
  };

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="font-medium text-gray-700">Add New Schedule</h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-3 md:col-span-1">
          <Label className="text-sm mb-2">Day</Label>
          <Select
            value={newSchedule.day}
            onValueChange={(value) =>
              setNewSchedule({ ...newSchedule, day: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {daysOfWeek
                .filter((day) => !availability.some((item) => item.day === day))
                .map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm mb-2">From</Label>
          <input
            type="time"
            value={newSchedule.from}
            onChange={(e) =>
              setNewSchedule({ ...newSchedule, from: e.target.value })
            }
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <Label className="text-sm mb-2">To</Label>
          <input
            type="time"
            value={newSchedule.to}
            onChange={(e) =>
              setNewSchedule({ ...newSchedule, to: e.target.value })
            }
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>
      <Button
        onClick={handleAddSchedule}
        disabled={!newSchedule.day}
        className="w-full cursor-pointer"
      >
        <Plus className="w-4 h-4 mr-2 " /> Add Schedule
      </Button>
    </div>
  );
};

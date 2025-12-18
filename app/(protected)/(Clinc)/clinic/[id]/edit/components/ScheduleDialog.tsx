"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight } from "lucide-react";
import { ScheduleList } from "./ScheduleList";
import { NewScheduleForm } from "./NewScheduleForm";

interface ScheduleDialogProps {
  availability: any[];
  setAvailability: React.Dispatch<React.SetStateAction<any[]>>;
}

export const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  availability,
  setAvailability,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div className="space-y-3 cursor-pointer">
          <label className="font-semibold text-gray-700 hover:text-blue-600 transition-colors ">
            Availability & Schedule <span className="text-red-500">*</span>
          </label>
          <div className="flex mt-2 items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Doctor's Schedule</h3>
                <p className="text-sm text-gray-500">
                  {availability.length} schedule(s) added
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 cursor-pointer" />
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Manage Schedule
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <ScheduleList
            availability={availability}
            setAvailability={setAvailability}
          />
          <NewScheduleForm
            availability={availability}
            setAvailability={setAvailability}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setDialogOpen(false)}
          >
            Close
          </Button>
          <Button
            className="cursor-pointer"
            onClick={() => setDialogOpen(false)}
          >
            Save Schedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

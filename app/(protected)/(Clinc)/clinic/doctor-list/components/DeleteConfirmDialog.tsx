"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  onDelete: () => void;
  name?: string;
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  onDelete,
  name,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Delete Doctor</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            doctor's record.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <strong className="font-semibold text-gray-900">{name}</strong>?
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="w-full sm:w-auto"
          >
            Delete Doctor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";

interface Props {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const ProfileHeader = ({ isEditing, onEdit, onCancel, onSave }: Props) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-gray-600">
          Manage your personal information and preferences
        </p>
      </div>

      <div className="flex items-center gap-3">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="gap-2" onClick={onSave}>
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </>
        ) : (
          <Button className="gap-2" onClick={onEdit}>
            <Edit className="h-4 w-4" /> Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;

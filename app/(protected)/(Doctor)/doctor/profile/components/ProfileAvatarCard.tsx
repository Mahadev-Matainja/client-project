import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DoctorCategories } from "@/services/DoctorService";

interface Props {
  isEditing: boolean;
  avatarUrl: string;
  personalInfo: any;
  fileInputRef: any;
  categories: any[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileAvatarCard: React.FC<Props> = ({
  isEditing,
  avatarUrl,
  personalInfo,
  fileInputRef,
  categories,
  onFileChange,
}) => {
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const specializationName =
    categories.find((cat) => cat.id === Number(personalInfo?.specialization))
      ?.name || "Not Selected";

  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="relative inline-block mb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={avatarUrl || "/noProfileImage.png"}
              alt="User Avatar"
            />
            <AvatarFallback className="text-2xl">
              {personalInfo.firstName ? personalInfo.firstName[0] : "U"}
            </AvatarFallback>
          </Avatar>

          {isEditing && (
            <>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                onClick={handleCameraClick}
              >
                <Camera className="h-4 w-4" />
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />
            </>
          )}
        </div>

        <h2 className="text-2xl font-bold">
          {personalInfo.firstName} {personalInfo.lastName}
        </h2>
        <p className="text-gray-600">{personalInfo.email}</p>
        <p className="text-gray-600">{personalInfo.phone}</p>
        <Badge className="bg-blue-600 text-white">{specializationName}</Badge>

        <div className="flex justify-center gap-2 mt-3">
          <Badge variant="outline">Verified</Badge>
          {personalInfo.doctorId && (
            <Badge variant="outline">Doctor ID: {personalInfo.doctorId}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileAvatarCard;

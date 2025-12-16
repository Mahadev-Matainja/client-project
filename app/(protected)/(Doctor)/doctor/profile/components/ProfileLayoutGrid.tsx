import React from "react";
import ProfileAvatarCard from "./ProfileAvatarCard";
import PersonalInfoForm from "./PersonalInfoForm";
import RegistrationForm from "./RegistratioForm";
import NotificationsSection from "./NotificationsSection";
import PrivacySection from "./PrivacySection";
import ProfileSkeleton from "@/components/ProfileSkeleton";

const ProfileLayoutGrid = ({
  isEditing,
  personalInfo,
  categories,
  council,
  notifications,
  loading,
  privacy,
  errors,
  qualifications,
  avatarUrl,
  fileInputRef,
  handleInputChange,
  onFileChange,
}: any) => {
  return (
    <>
      {loading ? (
        <ProfileSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="space-y-6">
            <ProfileAvatarCard
              isEditing={isEditing}
              avatarUrl={avatarUrl}
              categories={categories}
              personalInfo={personalInfo}
              fileInputRef={fileInputRef}
              onFileChange={onFileChange}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <PersonalInfoForm
              isEditing={isEditing}
              personalInfo={personalInfo}
              categories={categories}
              errors={errors}
              qualifications={qualifications}
              handleInputChange={handleInputChange}
            />

            <RegistrationForm
              isEditing={isEditing}
              council={council}
              personalInfo={personalInfo}
              handleInputChange={handleInputChange}
              errors={errors}
            />

            {/* <NotificationsSection
          isEditing={isEditing}
          notifications={notifications}
          handleInputChange={handleInputChange}
        />

        <PrivacySection
          isEditing={isEditing}
          privacy={privacy}
          handleInputChange={handleInputChange}
        /> */}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileLayoutGrid;

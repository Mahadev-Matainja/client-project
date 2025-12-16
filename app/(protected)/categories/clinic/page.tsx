import DoctorSearch from "@/components/DoctorSearch";
import MainLayout from "@/components/layout/main-layout";
import React from "react";
import ClinicList from "./components/ClinicList";

const page = () => {
  return (
    <MainLayout>
      <DoctorSearch />
      <ClinicList />
    </MainLayout>
  );
};

export default page;

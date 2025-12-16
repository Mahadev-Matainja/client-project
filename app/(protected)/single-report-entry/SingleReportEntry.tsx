"use client";

import React, { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import FilterWidgets from "./components/FilterWidgets";
import ReportInformation from "./components/ReportInformation";

const SingleReportEntry = () => {
  const [groupId, setGroupId] = useState<number | null>(null);
  const [parameterId, setParameterId] = useState<number | null>(null);
  const [testId, setTestId] = useState<number | null>(null);

  return (
    <MainLayout>
      <div className="space-y-6">
        <FilterWidgets
          parameterId={parameterId} // ✅ pass parameterId
          onSelectionChange={({ groupId, parameterId, testId }) => {
            setTestId(testId);
            setGroupId(groupId);
            setParameterId(parameterId);
          }}
        />
        <ReportInformation
          testId={testId}
          groupId={groupId}
          parameterId={parameterId}
          onResetParameter={() => setParameterId(null)} // ✅ resets after save
        />
      </div>
    </MainLayout>
  );
};

export default SingleReportEntry;

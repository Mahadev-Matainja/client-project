"use client";
import React, { useState } from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import { TestGroup, Parameter } from "@/@types/lab-test";

export type SelectedTestItem = {
  key: string;
  parameter: Parameter;
  groupId: number;
  groupName: string;
  testName: string;
  normalRange?: string;
  unit?: string;
  is_applicable?: boolean;
};

const TestEntry: React.FC = () => {
  const [selectedTests, setSelectedTests] = useState<SelectedTestItem[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

  // toggle single parameter selection
  const toggleTestSelection = (
    parameter: Parameter,
    groupId: number,
    groupName: string
  ) => {
    const key = `${groupId}_${parameter.id}`;
    setSelectedTests((prev) => {
      const exists = prev.find((s) => s.key === key);
      if (exists) {
        return prev.filter((s) => s.key !== key);
      }
      const newItem: SelectedTestItem = {
        key,
        parameter,
        groupId,
        groupName,
        testName: parameter.name,
        normalRange: `${parameter.start_range}-${parameter.end_range}`,
        unit: parameter.unit,
        is_applicable: parameter.is_applicable,
      };
      return [...prev, newItem];
    });
  };

  // select/deselect all parameters for a group
  const selectAllGroupTests = (group: TestGroup) => {
    const groupId = group.id;
    const allKeys = group.parameters.map((p) => `${groupId}_${p.id}`);

    setSelectedTests((prev) => {
      const allSelected = allKeys.every((k) => prev.some((s) => s.key === k));
      if (allSelected) {
        // deselect all that belong to this group
        return prev.filter((s) => !allKeys.includes(s.key));
      } else {
        // add missing ones
        const toAdd = group.parameters
          .filter((p) => !prev.some((s) => s.key === `${groupId}_${p.id}`))
          .map((p) => ({
            key: `${groupId}_${p.id}`,
            parameter: p,
            groupId,
            groupName: group.name,
            testName: p.name,
            normalRange: `${p.start_range}-${p.end_range}`,
            unit: p.unit,
            is_applicable: p.is_applicable,
          }));
        return [...prev, ...toAdd];
      }
    });
  };

  const removeSelectedTest = (key: string) => {
    setSelectedTests((prev) => prev.filter((s) => s.key !== key));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <LeftPanel
        selectedTests={selectedTests}
        onToggleTest={toggleTestSelection}
        onSelectAllGroupTests={selectAllGroupTests}
        setSelectedTestId={setSelectedTestId}
      />

      <RightPanel
        selectedTests={selectedTests}
        onRemoveTest={removeSelectedTest}
        selectedTestId={selectedTestId}
        onResetTests={() => setSelectedTests([])}
      />
    </div>
  );
};

export default TestEntry;

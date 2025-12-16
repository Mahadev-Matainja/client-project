"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Loader2 } from "lucide-react";
import { fetchTests, selectTest } from "@/services/TestsService";

interface Test {
  id: number;
  name: string;
  key: string;
  priyority: number;
  is_default: boolean;
}

type Parameter = {
  id: number;
  testgroup_id: number;
  name: string;
  key: string;
  unit: string;
  start_range?: string;
  end_range?: string;
};

type Group = {
  id: number;
  name: string;
  key: string;
  priyority: number;
  parameters: Parameter[];
};

interface FilterWidgetsProps {
  onSelectionChange: (data: {
    testId: number | null;
    groupId: number | null;
    parameterId: number | null;
  }) => void;
  parameterId: number | null;
}

const FilterWidgets: React.FC<FilterWidgetsProps> = ({
  onSelectionChange,
  parameterId,
}) => {
  const [testsData, setTestsData] = useState<Test[]>([]);
  const [groupsData, setGroupsData] = useState<Group[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string>("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedParameter, setSelectedParameter] = useState<Parameter | null>(
    null
  );

  const selectedGroup = useMemo(
    () => groupsData.find((g) => g.id === Number(selectedGroupId)) || null,
    [groupsData, selectedGroupId]
  );

  useEffect(() => {
    const loadTests = async () => {
      setLoading(true);
      try {
        const response = await fetchTests();
        setTestsData(response.data || []);

        const defaultTest = response.data.find((test: Test) => test.is_default);
        if (defaultTest) {
          setSelectedTestId(String(defaultTest.id));
          const groupsRes = await selectTest(defaultTest.id);
          setGroupsData(groupsRes.data || []);

          if (groupsRes.data && groupsRes.data.length > 0) {
            setSelectedGroupId(String(groupsRes.data[0].id));
          }
        }
      } catch (error) {
        console.error("Failed to fetch tests:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, []);

  // ✅ Whenever parent resets parameterId → clear dropdown
  useEffect(() => {
    if (!parameterId) {
      setSelectedParameter(null);
    }
  }, [parameterId]);

  const handleTestChange = async (value: string) => {
    setSelectedTestId(value);
    setLoading(true);
    try {
      const groupsRes = await selectTest(Number(value));
      setGroupsData(groupsRes.data || []);

      if (groupsRes.data && groupsRes.data.length > 0) {
        setSelectedGroupId(String(groupsRes.data[0].id));
        setSelectedParameter(null);
      } else {
        setSelectedGroupId("");
        setSelectedParameter(null);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupChange = (value: string) => {
    setSelectedGroupId(value);
    setSelectedParameter(null);
  };

  const handleParameterChange = (paramId: string) => {
    const param =
      selectedGroup?.parameters.find((p) => p.id === Number(paramId)) || null;
    setSelectedParameter(param);
  };

  // notify parent whenever group/parameter changes
  useEffect(() => {
    if (selectedGroup) {
      onSelectionChange({
        groupId: selectedGroup.id,
        parameterId: selectedParameter ? selectedParameter.id : null,
        testId: Number(selectedTestId),
      });
    }
  }, [selectedGroup, selectedParameter, selectedTestId, onSelectionChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Test, Group & Parameter</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Test Dropdown */}
        <Select
          value={selectedTestId}
          onValueChange={handleTestChange}
          disabled={loading}
        >
          <SelectTrigger className="w-full flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <SelectValue placeholder="Select Test" />
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </SelectTrigger>
          <SelectContent>
            {testsData.map((test) => (
              <SelectItem key={test.id} value={String(test.id)}>
                {test.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Group Dropdown */}
        <Select
          value={selectedGroupId}
          onValueChange={handleGroupChange}
          disabled={loading || !groupsData.length}
        >
          <SelectTrigger className="w-full flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <SelectValue placeholder="Select Group" />
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </SelectTrigger>
          <SelectContent>
            {groupsData.map((group) => (
              <SelectItem key={group.id} value={String(group.id)}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Parameter Dropdown (optional) */}
        <Select
          value={selectedParameter?.id?.toString() ?? "none"}
          onValueChange={(val) => {
            if (val === "none") {
              handleParameterChange("");
            } else {
              handleParameterChange(val);
            }
          }}
          disabled={!selectedGroup}
        >
          <SelectTrigger className="w-full flex items-center gap-2">
            <SelectValue placeholder="Select Parameter (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select sub sub test</SelectItem>
            {selectedGroup?.parameters?.map((param) => (
              <SelectItem key={param.id} value={param.id.toString()}>
                {param.name} ({param.unit})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default FilterWidgets;

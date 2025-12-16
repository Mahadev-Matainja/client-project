"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox"; // shadcn checkbox
import { fetchTests, selectTest } from "@/services/TestsService";
import { TestGroup, Parameter } from "@/@types/lab-test";
import { SelectedTestItem } from "./TestEntry";
import { Input } from "@/components/ui/input";

type Props = {
  selectedTests: SelectedTestItem[];
  onToggleTest: (
    parameter: Parameter,
    groupId: number,
    groupName: string
  ) => void;
  onSelectAllGroupTests: (group: TestGroup) => void;
  setSelectedTestId: React.Dispatch<React.SetStateAction<number | null>>;
};

const LeftPanel: React.FC<Props> = ({
  selectedTests,
  onToggleTest,
  onSelectAllGroupTests,
  setSelectedTestId,
}) => {
  const [testsData, setTestsData] = useState<any[]>([]);
  const [testsList, setTestsList] = useState<TestGroup[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTests, setLoadingTests] = useState<boolean>(false);
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});
  const [search, setSearch] = useState("");

  const handleTestSelectGroup = async (id: number) => {
    const test = testsData.find((t) => t.id === id);
    if (test) setSelected(test.name);
    setSelectedTestId(id);
    setLoadingTests(true);

    try {
      const res = await selectTest(id);
      if (res?.data) {
        const sorted = res.data.sort(
          (a: TestGroup, b: TestGroup) => a.priyority - b.priyority
        );
        setTestsList(sorted);
      }
    } catch (err) {
      console.error("Error fetching tests:", err);
    } finally {
      setLoadingTests(false);
    }
  };

  const toggleGroup = (groupId: number) =>
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));

  useEffect(() => {
    const getData = async () => {
      if (loading) {
        return;
      }
      try {
        setLoading(true);
        const res = await fetchTests();
        setTestsData(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (testsData?.length > 0 && !selected) {
      const defaultTest = [...testsData].sort(
        (a, b) => a.priyority - b.priyority
      )[0];
      if (defaultTest) {
        handleTestSelectGroup(defaultTest.id);
        setSelected(defaultTest.name);
        setSelectedTestId(defaultTest.id);
      }
    }
  }, [testsData, selected]);

  return (
    <div className="lg:col-span-1">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Select Tests
          </CardTitle>
          <CardDescription>
            Choose test parameters to enter values
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : !testsData.length ? (
            <p className="text-muted-foreground text-sm">No tests found !!</p>
          ) : (
            <>
              {/* Dropdown with search filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="w-full flex items-center justify-between border rounded-md px-3 py-2 bg-white cursor-pointer">
                    <span>{selected || "Select Test"}</span>
                    <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) p-2"
                  align="start"
                >
                  {/* Search box */}
                  <Input
                    autoFocus
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <ScrollArea className="max-h-60">
                    {testsData.filter((test) =>
                      test.name.toLowerCase().includes(search.toLowerCase())
                    ).length === 0 ? (
                      <div className="px-2 py-1 text-sm mt-2 text-gray-500">
                        No results found
                      </div>
                    ) : (
                      testsData
                        .filter((test) =>
                          test.name.toLowerCase().includes(search.toLowerCase())
                        )
                        .map((test) => (
                          <DropdownMenuItem
                            key={test.id}
                            onSelect={() => handleTestSelectGroup(test.id)}
                            className="flex items-center justify-between w-full cursor-pointer"
                          >
                            <span>{test.name}</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </DropdownMenuItem>
                        ))
                    )}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>

              {loadingTests ? (
                <p className="mt-2">Loading groups...</p>
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {testsList.map((group) => (
                      <Collapsible
                        key={group.id}
                        open={!!openGroups[group.id]}
                        onOpenChange={() => toggleGroup(group.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-between p-3 h-auto"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-left">
                                <p className="font-medium">{group.name}</p>
                                <p className="text-xs text-gray-500">
                                  {group.parameters.length} tests
                                </p>
                              </div>
                            </div>

                            {openGroups[group.id] ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="space-y-2 mt-2">
                          <div className="ml-4 mb-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onSelectAllGroupTests(group)}
                              className="text-xs"
                            >
                              {group.parameters.every((param) =>
                                selectedTests.some(
                                  (test) =>
                                    test.key === `${group.id}_${param.id}`
                                )
                              )
                                ? "Deselect All"
                                : "Select All"}
                            </Button>
                          </div>

                          {group.parameters.map((parameter) => {
                            const testKey = `${group.id}_${parameter.id}`;
                            const isSelected = selectedTests.some(
                              (t) => t.key === testKey
                            );

                            return (
                              <div
                                key={parameter.id}
                                className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors ml-4 ${
                                  isSelected
                                    ? "bg-blue-50 border-blue-200"
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() =>
                                  onToggleTest(parameter, group.id, group.name)
                                }
                              >
                                <Checkbox checked={isSelected} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {parameter.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {parameter.start_range} -{" "}
                                    {parameter.end_range}
                                    {parameter.unit}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeftPanel;

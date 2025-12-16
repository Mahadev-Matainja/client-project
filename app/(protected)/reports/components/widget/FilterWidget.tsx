import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Filter, Loader } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import api from "@/utils/api";
import { ReportsFilterType } from "../../Reports";
import { toast } from "@/hooks/use-toast";

type Props = {
  filter: ReportsFilterType;
  setFilter: (value: ReportsFilterType) => void;
  response?: boolean;
};

type Test = {
  id: number;
  name: string;
  key: string;
  priyority: number;
  is_default?: boolean;
};

type Parameters = {
  id: number;
  testgroup_id: number;
  name: string;
  key: string;
  unit: string;
  start_range: string;
  end_range: string;
};

type Group = {
  id: number;
  name: string;
  key: string;
  priyority: number;
  parameters: Parameters[];
};

type DateRange = {
  name: string;
  key: string;
};

const DateRangeOption: DateRange[] = [
  {
    key: "today",
    name: "Today",
  },
  {
    key: "last_month",
    name: "Last Month",
  },
  {
    key: "last_6_month",
    name: "Last 6 Month",
  },
  {
    key: "last_year",
    name: "Last Year",
  },
  {
    key: "last_2_year",
    name: "Last 2 Year",
  },
  {
    key: "custom",
    name: "Custom",
  },
];

const FilterWidgets = ({ filter, setFilter, response }: Props) => {
  const [tempFilter, setTempFilter] = useState(filter);
  const [testOption, setTestOption] = useState<Test[]>([]);
  const [testOptionLoading, setTestOptionLoading] = useState<boolean>(false);
  const [groupOption, setGroupOption] = useState<Group[]>([]);
  const [groupOptionLoading, setGroupOptionLoading] = useState<boolean>(false);
  const [parameterOption, setParameterOption] = useState<Parameters[]>([]);
  const [dateRangeOption, setDateRangeOption] =
    useState<DateRange[]>(DateRangeOption);
  const [initial, setInitial] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (testOptionLoading) {
        return;
      }

      setTestOptionLoading(true);

      try {
        // Fetch initial data
        const { data } = await api.get("/tests");

        setTestOption(data.data);

        // Set default test if available
        const defaultTest = data.data.find((test: Test) => test.is_default);
        if (defaultTest) {
          setTempFilter((prev) => ({ ...prev, test: String(defaultTest.id) }));
        }
      } catch (error: any) {
        toast({
          title: error.message,
        });
      } finally {
        setTestOptionLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (tempFilter.test !== "Select Test") {
      const fetchData = async () => {
        // if (groupOptionLoading) {
        //   return;
        // }

        setGroupOptionLoading(true);
        try {
          const { data } = await api.get(`/tests/${tempFilter.test}`);

          setGroupOption(data.data);
        } catch (error: any) {
          toast({
            title: error.message,
          });
        } finally {
          setGroupOptionLoading(false);
        }
      };

      fetchData();
    }

    if (tempFilter.group !== "Select Group") {
      const selectedGroup = groupOption.find(
        (g) => String(g.id) === tempFilter.group
      );

      if (selectedGroup) {
        setParameterOption(selectedGroup.parameters);
      }
    }

    // get result for the first time
    if (initial && tempFilter.test !== "Select Test") {
      onSearch();
      setInitial(false);
    }
  }, [tempFilter]);

  useEffect(() => {
    setTempFilter({
      ...tempFilter,
      group: "Select Group",
      parameter: "Select Parameter",
    });
  }, [tempFilter.test]);

  const onSearch = () => {
    setFilter(tempFilter);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div
          className={`grid grid-cols-1 gap-4 ${
            tempFilter.dateRange === "custom"
              ? "md:grid-cols-4"
              : "md:grid-cols-5"
          } `}
        >
          <Select
            value={tempFilter.test}
            onValueChange={(e) => setTempFilter({ ...tempFilter, test: e })}
            disabled={testOptionLoading}
          >
            <SelectTrigger className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
              {testOptionLoading && <Loader />}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Select Test" defaultChecked>
                Select Test
              </SelectItem>
              {testOption.map((test, index) => {
                return (
                  <SelectItem key={index} value={String(test.id)}>
                    {test.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Select
            value={tempFilter.group}
            onValueChange={(e) => setTempFilter({ ...tempFilter, group: e })}
            disabled={tempFilter.test === "Select Test" || groupOptionLoading}
          >
            <SelectTrigger className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
              {groupOptionLoading && <Loader />}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Select Group" defaultChecked>
                Select Sub Test
              </SelectItem>
              {groupOption.map((group, index) => (
                <SelectItem key={index} value={String(group.id)}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={tempFilter.parameter}
            onValueChange={(e) =>
              setTempFilter({ ...tempFilter, parameter: e })
            }
            disabled={tempFilter.group === "Select Group"}
          >
            <SelectTrigger className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Select Parameter" defaultChecked>
                Select Sub Sub Test
              </SelectItem>
              {parameterOption.map((parameter, index) => (
                <SelectItem key={index} value={String(parameter.id)}>
                  {parameter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={tempFilter.dateRange}
            onValueChange={(e) =>
              setTempFilter({ ...tempFilter, dateRange: e })
            }
          >
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_range" defaultChecked>
                Date Range
              </SelectItem>
              {dateRangeOption.map((date, index) => (
                <SelectItem key={index} value={date.key}>
                  {date.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {tempFilter.dateRange === "custom" && (
            <>
              <div className="">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tempFilter.startDate ? (
                        format(tempFilter.startDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={tempFilter.startDate || undefined}
                      captionLayout="dropdown"
                      onSelect={(e) =>
                        setTempFilter({ ...tempFilter, startDate: e || null })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tempFilter.endDate ? (
                        format(tempFilter.endDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={tempFilter.endDate || undefined}
                      captionLayout="dropdown"
                      onSelect={(e) =>
                        setTempFilter({ ...tempFilter, endDate: e || null })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          <div>
            <Button
              onClick={onSearch}
              className="cursor-pointer"
              disabled={response}
            >
              {response ? "Loading..." : "Search"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterWidgets;

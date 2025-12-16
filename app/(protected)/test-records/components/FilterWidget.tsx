import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Filter } from "lucide-react";
import { TestRecordFilter } from "../page";
import api from "@/utils/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

type Props = {
  filter: TestRecordFilter;
  setFilter: (value: TestRecordFilter) => void;
  response?: boolean;
};

type Test = {
  id: number;
  name: string;
  key: string;
  priyority: number;
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

const FilterWidget = ({ filter, setFilter, response = false }: Props) => {
  const [tempFilter, setTempFilter] = useState<TestRecordFilter>(filter);
  const [testOption, setTestOption] = useState<Test[]>([]);
  const [groupOption, setGroupOption] = useState<Group[]>([]);
  const [parameterOption, setParameterOption] = useState<Parameters[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch initial data
      const { data } = await api.get("/tests");

      setTestOption(data.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (tempFilter.test !== "") {
      const fetchData = async () => {
        const { data } = await api.get(`/tests/${tempFilter.test}`);

        setGroupOption(data.data);
      };

      fetchData();
    }

    if (tempFilter.group !== "") {
      const selectedGroup = groupOption.find(
        (g) => String(g.id) === tempFilter.group
      );

      if (selectedGroup) {
        setParameterOption(selectedGroup.parameters);
      }
    }
  }, [tempFilter]);

  const onSearch = () => {
    setFilter(tempFilter);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid md:grid-cols-3 gap-4">
          <Select
            value={tempFilter.test}
            onValueChange={(e) => setTempFilter({ ...tempFilter, test: e })}
          >
            <SelectTrigger className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Please Select Test" defaultChecked>
                Select Test
              </SelectItem>
              {testOption.map((test, index) => (
                <SelectItem key={index} value={String(test.id)}>
                  {test.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={tempFilter.group}
            onValueChange={(e) => setTempFilter({ ...tempFilter, group: e })}
            disabled={tempFilter.test === "Please Select Test"}
          >
            <SelectTrigger className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Please Select Group" defaultChecked>
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
            disabled={tempFilter.group === "Please Select Group"}
          >
            <SelectTrigger className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Please Select Parameter" defaultChecked>
                Select Sub Sub Test
              </SelectItem>
              {parameterOption.map((parameter, index) => (
                <SelectItem key={index} value={String(parameter.id)}>
                  {parameter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-full">
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
                  onSelect={(e) =>
                    setTempFilter({ ...tempFilter, startDate: e || null })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-full">
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
                  onSelect={(e) =>
                    setTempFilter({ ...tempFilter, endDate: e || null })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

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

export default FilterWidget;

"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter, Loader } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import api from "@/utils/api";
import { TestCompareFilterType } from "../../TestCompare";

type Props = { filter: TestCompareFilterType; setFilter: (v: TestCompareFilterType) => void; response?: boolean; };

type Test = { id: number; name: string; key: string; priyority: number; is_default?: boolean; };
type Parameters = { id: number; testgroup_id: number; name: string; key: string; unit: string; start_range: string; end_range: string; };
type Group = { id: number; name: string; key: string; priyority: number; parameters: Parameters[]; };
type DateRange = { name: string; key: string; };

const DateRangeOption: DateRange[] = [
  { key: "today", name: "Today" },
  { key: "last_month", name: "Last Month" },
  { key: "last_6_month", name: "Last 6 Month" },
  { key: "last_year", name: "Last Year" },
  { key: "last_2_year", name: "Last 2 Year" },
  { key: "custom", name: "Custom" },
];

const FilterWidgets = ({ filter, setFilter, response }: Props) => {
  const [tempFilter, setTempFilter] = useState(filter);
  const [testOption, setTestOption] = useState<Test[]>([]);
  const [groupOption, setGroupOption] = useState<Group[]>([]);
  const [parameterOption, setParameterOption] = useState<Parameters[]>([]);
  const [dateRangeOption] = useState<DateRange[]>(DateRangeOption);

  // 👇 Global loader from axios (like RTK Query)
  const [loading, setLoading] = useState<boolean>(false);
  // useEffect(() => onLoadingChange(setLoading), []);

  const didInit = useRef(false);

  // --- Initial fetch: tests (+ set default)
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    (async () => {
      try {
        const { data } = await api.get("/tests");
        setTestOption(data.data);

        const def: Test | undefined = data.data.find((t: Test) => t.is_default);
        if (def) {
          setTempFilter((prev) => ({ ...prev, test: String(def.id) }));
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // --- When test changes: fetch groups, reset group/parameter, preload parameters
  useEffect(() => {
    if (tempFilter.test === "Select Test") return;

    (async () => {
      try {
        const { data } = await api.get(`/tests/${tempFilter.test}`);
        setGroupOption(data.data);
        // reset selections on test change
        setTempFilter((prev) => ({
          ...prev,
          group: "Select Group",
          parameter: "Select Parameter",
        }));
        setParameterOption([]);
      } catch (e) {
        console.error(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempFilter.test]);

  // --- When group changes: populate parameters from cached groups
  useEffect(() => {
    if (tempFilter.group === "Select Group") {
      setParameterOption([]);
      return;
    }
    const g = groupOption.find((x) => String(x.id) === tempFilter.group);
    setParameterOption(g?.parameters ?? []);
  }, [tempFilter.group, groupOption]);

  const onSearch = () => setFilter(tempFilter);

  return (
    <Card>
      <CardContent className="p-4">
        <div className={`grid grid-cols-1 gap-4 ${tempFilter.dateRange === "custom" ? "md:grid-cols-4" : "md:grid-cols-5"}`}>
          {/* Test */}
          <Select
            value={tempFilter.test}
            onValueChange={(e) => setTempFilter({ ...tempFilter, test: e })}
            disabled={loading}
          >
            <SelectTrigger className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select Test" />
              {loading && <Loader className="ml-2 h-4 w-4 animate-spin" />}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Select Test">Select Test</SelectItem>
              {testOption.map((test) => (
                <SelectItem key={test.id} value={String(test.id)}>
                  {test.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Group */}
          <Select
            value={tempFilter.group}
            onValueChange={(e) => setTempFilter({ ...tempFilter, group: e })}
            disabled={tempFilter.test === "Select Test" || loading}
          >
            <SelectTrigger className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select Sub Test" />
              {loading && <Loader className="ml-2 h-4 w-4 animate-spin" />}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Select Group">Select Sub Test</SelectItem>
              {groupOption.map((group) => (
                <SelectItem key={group.id} value={String(group.id)}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Parameter */}
          <Select
            value={tempFilter.parameter}
            onValueChange={(e) => setTempFilter({ ...tempFilter, parameter: e })}
            disabled={tempFilter.group === "Select Group" || loading}
          >
            <SelectTrigger className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select Sub Sub Test" />
              {loading && <Loader className="ml-2 h-4 w-4 animate-spin" />}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Select Parameter">Select Sub Sub Test</SelectItem>
              {parameterOption.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range */}
          <Select
            value={tempFilter.dateRange}
            onValueChange={(e) => setTempFilter({ ...tempFilter, dateRange: e })}
            disabled={loading}
          >
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_range">Date Range</SelectItem>
              {dateRangeOption.map((d) => (
                <SelectItem key={d.key} value={d.key}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Custom dates */}
          {tempFilter.dateRange === "custom" && (
            <>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={loading}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tempFilter.startDate ? format(tempFilter.startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={tempFilter.startDate || undefined}
                      captionLayout="dropdown"
                      onSelect={(e) => setTempFilter({ ...tempFilter, startDate: e || null })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={loading}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tempFilter.endDate ? format(tempFilter.endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={tempFilter.endDate || undefined}
                      captionLayout="dropdown"
                      onSelect={(e) => setTempFilter({ ...tempFilter, endDate: e || null })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          <div>
            <Button onClick={onSearch} className="cursor-pointer" disabled={response || loading}>
              {response || loading ? "Loading..." : "Search"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterWidgets;

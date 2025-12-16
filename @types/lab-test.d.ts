
export interface Parameter {
  id: number;
  name: string;
  measurement_unit?: string;
  start_range?: string;
  end_range?: string;
  category?: string;
  unit?: string;
  normalRange?: string | null;
  is_applicable?:boolean
}

export interface TestGroup {
  id: number;
  name: string;
  priyority: number;
  parameters: Parameter[];
}

export interface SelectedTest {
  key: string;
  groupId: number;
  groupName: string;
  testId: number;
  testName: string;
  unit?: string;
  normalRange?: string | null;
  category?: string;
}

export interface TestPayload {
  test_id: string;
  group_id: string;
  parameter_id: string;
  test_value: string;
  test_report: file | null;
  description: string;
  remark: string;
}

export interface EntryPayload {
  date_of_test: string;
  lab_name: string;
  doctor_name: string;
  tests: TestPayload[];
}

//analytics

export interface UIMetric {
  name: string;
  priority?: number 
  value: string;
  normal_range:string;
  unit:string;
  status: string;
  
}

export interface APIMetricResponse {
  name: string;
  value: string;
  unit: string;
  normal_range: string;
  status: string;
  priority?: number
}

interface APICard {
  name: string;
  groupName: string;
  value: string;
  unit: string;
  normal_range: string;
  status: string;
}
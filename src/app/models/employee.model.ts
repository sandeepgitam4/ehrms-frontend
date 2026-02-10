export interface Employee {
  employee_id?: string;
  full_name: string;
  email: string;
  department: string;
}

export interface Attendance {
  employee_id: string;
  date: string;
  status: string;
  full_name?: string;
}

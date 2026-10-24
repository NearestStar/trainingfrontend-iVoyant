
export type EmployeeStatus = "Active" | "Inactive";

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  salary: number;
  status: EmployeeStatus;
}

export type EmployeeInput = Omit<Employee, "id">;

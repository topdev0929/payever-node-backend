import { Employee } from './employee.interface';

export interface EmployeeListInterface {
  total: number;
  perPage: number;
  page: number;
  list: Employee[];
}

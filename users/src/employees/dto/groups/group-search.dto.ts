import { EmployeeSortDto } from '../employees/employee-sort.dto';

export interface GroupSearchDto {
  name?: string;
  employee?: EmployeeSortDto;
}

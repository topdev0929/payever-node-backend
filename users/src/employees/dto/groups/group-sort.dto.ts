import { EmployeeSortDto } from '../employees/employee-sort.dto';

export interface GroupSortDto {
  name?: 1 | -1;
  employee?: EmployeeSortDto;
}

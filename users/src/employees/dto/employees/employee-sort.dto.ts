export interface EmployeeSortDto {
  firstName?: 1 | -1;
  lastName?: 1 | -1;
  email?: 1 | -1;
  positions?: {
    positionType?: 1 | -1;
    status?: 1 | -1;
  };
}

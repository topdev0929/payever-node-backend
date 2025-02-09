export interface EmployeeOrderDto {
  email?: '1' | '-1';
  firstName?: '1' | '-1';
  lastName?: '1' | '-1';
  positions?: {
    positionType?: '1' | '-1';
    status?: '1' | '-1';
  };
  updatedAt?: '1' | '-1';
}

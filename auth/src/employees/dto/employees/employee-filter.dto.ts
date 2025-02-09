export interface EmployeeFilterDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  positions?: {
    positionType?: string;
    status?: number;
  };
}

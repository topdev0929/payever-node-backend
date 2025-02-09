export interface EmployeeFilterDto {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  positions?: {
    positionType?: string;
    status?: number;
  };
}

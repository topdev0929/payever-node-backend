export interface EmployeeFilterInterface {
  firstName?: { $regex: RegExp };
  lastName?: { $regex: RegExp };
  fullName?: { $regex: RegExp };
  email?: { $regex: RegExp };
  positions?: {
    positionType?: { $regex: RegExp };
    status?: { $regex: RegExp };
  };
}

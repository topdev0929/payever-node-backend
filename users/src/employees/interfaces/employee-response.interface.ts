import { Status } from '../enum';

export interface EmployeeResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  position?: string;
  status?: Status;
  groups: [
    {
      _id: string;
      name: string;
    },
  ];
}

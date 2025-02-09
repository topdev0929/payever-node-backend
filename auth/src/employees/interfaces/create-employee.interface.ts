import { Positions } from '../enum/positions.enum';

export interface CreateEmployeeInterface {
  email: string;
  firstName: string;
  lastName: string;
  position: Positions;
  userId?: string;
}

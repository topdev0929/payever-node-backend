import { Status } from '../enum';
import { Positions } from '../enum/positions.enum';

export interface UpdateEmployeeInterface {
  position: Positions;
  status: Status;
  logo?: string;
}

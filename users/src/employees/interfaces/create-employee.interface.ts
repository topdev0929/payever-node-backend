import { Status } from '../enum';
import { Positions } from '../enum/positions.enum';
import { AddressInterface } from './address.interface';

export interface CreateEmployeeInterface {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  position: Positions;
  companyName?: string;
  phoneNumber?: string;
  address: AddressInterface;
  status: Status;
  logo?: string;
}

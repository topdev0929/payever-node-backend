import { Document } from 'mongoose';
import { PositionInterface } from './position.interface';
import { AddressInterface } from './address.interface';

export interface EmployeeDetail extends Document {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  employeeId: string;
  companyName?: string;
  phoneNumber?: string;
  address: AddressInterface;
  position: PositionInterface;
  language?: string;
  logo?: string;
  isActive?: boolean;
}

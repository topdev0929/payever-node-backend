import { Document } from 'mongoose';
import { PositionInterface } from './position.interface';
import { AddressInterface } from './address.interface';

export interface Employee extends Document {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  companyName?: string;
  phoneNumber?: string;
  address: AddressInterface;
  positions: PositionInterface[];
  language?: string;
  logo?: string;

  isVerified?: boolean;
  isActive?: boolean;
}

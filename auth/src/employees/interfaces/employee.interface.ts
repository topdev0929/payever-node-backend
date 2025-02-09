import { Document } from 'mongoose';
import { PermissionInterface, UserRoleInterface } from '@pe/nest-kit';
import { PositionInterface } from './position.interface';

export interface EmployeeInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  permissions: PermissionInterface[];
  positions: PositionInterface[];
  language?: string;
  roles: UserRoleInterface[];
  salt: string;
  password: string;
  userId: string;

  isVerified?: boolean;
  isActive?: boolean;
}

export interface Employee extends EmployeeInterface, Document<string> {
  id: string;
}

export type EmployeeDocument = Employee;




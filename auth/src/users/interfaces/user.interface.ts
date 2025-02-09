import { RolesMixin } from '@pe/nest-kit';
import { Document } from 'mongoose';

export interface UserInterface {
  id: string;
  email: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;

  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  unverifiedPeriodExpires?: Date;
  isVerified?: boolean;
  needsApprove?: boolean;
  isApproved?: boolean;
  isActive?: boolean;
  isRevoked?: boolean;
  logo?: string;
  language?: string;
  secondFactorRequired?: boolean;
  ipAddress?: string;
  generalAccount?: boolean;
  revokeAccountDateAt?: Date;
  updatedAt: Date;
}

export interface User extends UserInterface, RolesMixin, Document<string> {
  id: string;

  createdAt: Date;
}

export type UserDocument = User;

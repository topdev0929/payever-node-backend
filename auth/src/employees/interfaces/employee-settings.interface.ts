import { Document } from 'mongoose';

export interface EmployeeSettings extends Document {
  name: string;
  businessId: string;
  expiryHours: number;
}

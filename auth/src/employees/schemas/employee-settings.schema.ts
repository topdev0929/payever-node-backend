import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { DEAFULT_EMPLOYEE_TOKEN_EXPIRY_HOURS } from '../constants';

export const EmployeeSettingSchemaName: string = 'EmployeeSetting';

export const EmployeeSettingSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: String,
    expiryHours: { type: Number, default: DEAFULT_EMPLOYEE_TOKEN_EXPIRY_HOURS },
  },
)
  .index({ businessId: 1 });

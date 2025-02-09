import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { EmployeeSchemaName } from './employee.schema';
import * as uniqueValidator from 'mongoose-beautiful-unique-validation';
import { UNIQUE_NAME } from '../constants/errors';

export const GroupsSchemaName: string = 'Groups';

export const GroupsSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: String,
    employees: [
      {
        ref: EmployeeSchemaName,
        type: String,
      },
    ],
    name: { type: String },
  },
  { collection: 'groups' },
)
  .index({ employees: 1 })
  .index({ name: 1, businessId: 1 }, { unique: true })
  .plugin(uniqueValidator, { message: UNIQUE_NAME });

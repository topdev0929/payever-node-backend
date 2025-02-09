import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import * as uniqueValidator from 'mongoose-beautiful-unique-validation';
import { UNIQUE_NAME } from '../constants/errors';
import { EmployeeSchemaName, PositionSchema } from './employee.schema';

export const EmployeeDetailSchemaName: string = 'Employeedetail';

export const EmployeeDetailSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    address: {
      city: String,
      country: String,
      state: String,
      street: String,
      zipCode: String,
    },
    deleted: { type: Boolean, default: false },
    companyName: String,
    firstName: { type: String, collation: 'en' },
    isActive: Boolean,
    language: String,
    employeeId: { type: String, required: true, ref: EmployeeSchemaName },
    lastName: { type: String, collation: 'en' },
    logo: String,
    phoneNumber: String,
    position: { type: PositionSchema, required: true },
    userId: String,
  },
  {
    autoIndex: true,
    collection: 'employeedetails',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)
  .index({ _id: 1, 'position.businessId': 1 }, { unique: true, sparse: true })
  .index({ employeeId: 1 })
  .index({ employeeId: 1, 'position.businessId': 1 })
  .plugin(uniqueValidator, { message: UNIQUE_NAME });

EmployeeDetailSchema.virtual('fullName').get(function (): string {
  if (!this.firstName || !this.lastName) {
    return;
  }

  return (this.fullName = this.firstName + ' ' + this.lastName);
});

import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { PermissionSchema } from '../../users/schemas';
import * as uniqueValidator from 'mongoose-unique-validator';
import { UNIQUE_NAME } from '../constants/errors';


export const PositionSchema: Schema = new Schema(
  {
    businessId: { type: String, required: true },
    needApproval: Boolean,
    positionType: {
      enum: ['Cashier', 'Sales', 'Marketing', 'Staff', 'Admin', 'Others'],
      required: true,
      type: String,
    },
    status: {
      enum: [0, 1, 2, 3],
      required: true,
      type: Number,
    },
  },
  {
    _id: false,
  },
);

export const EmployeeSchemaName: string = 'Employee';

export const EmployeeSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    email: { type: String, required: true },
    firstName: { type: String, collation: 'en' },
    isActive: Boolean,
    isVerified: Boolean,
    language: String,
    lastName: { type: String, collation: 'en' },
    password: String,
    permissions: [PermissionSchema],
    positions: { type: [PositionSchema], required: true },
    salt: String,
    userId: String,
  },
  {
    autoIndex: true,
    collection: 'employees',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)
  .index({ _id: 1, 'position.businessId': 1 }, { unique: true, sparse: true })
  .index({ email: 1, 'position.businessId': 1 })
  .index({ email: 1 }, { unique: true })
  .plugin(uniqueValidator, { message: UNIQUE_NAME });

EmployeeSchema.virtual('fullName').get(function (): string {
  if (!this.firstName || !this.lastName) {
    return;
  }

  return (this.fullName = this.firstName + ' ' + this.lastName);
});

import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const PlanCustomerSchemaName: string = 'PlanCustomer';

export const PlanCustomerSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    city: String,
    companyName: String,
    country: String,
    email: String,
    image: String,
    name: String,
    userId: { type: String },
  }, 
  {
    timestamps: { createdAt: true, updatedAt: false },
  });

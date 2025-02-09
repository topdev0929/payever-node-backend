import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { EmployeeActivityHistoryTypeEnum } from '../enum';

export const EmployeeActivityHistorySchemaName: string = 'EmployeeActivityHistory';

export const EmployeeActivityHistorySchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: String, required: true },
    by: String,
    documentId: { type: String, required: true },
    field: { type: String, enum: Object.values(EmployeeActivityHistoryTypeEnum), required: true },
    value: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  },
);

import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ApiLogRequestSchema } from './api-log-request.schema';
import { ApiLogResponseSchema } from './api-log-response.schema';

export const ApiLogSchemaName: string = 'ApiLog';

export const ApiLogSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: String,
    request: ApiLogRequestSchema,
    response: ApiLogResponseSchema,
    responseTime: Number,
    serviceName: String,
    source: String,
    userEmail: String,
    userId: String,
  },
  { timestamps: true },
);

ApiLogSchema.index({ userId: 1, userEmail: 1, businessId: 1 });


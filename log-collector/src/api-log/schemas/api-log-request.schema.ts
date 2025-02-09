import { Schema } from 'mongoose';

export const ApiLogRequestSchema: Schema = new Schema(
  {
    body: Schema.Types.Mixed,
    headers: Schema.Types.Mixed,
    hostname: String,
    id: String,
    ip: String,
    ips: [String],
    log: Schema.Types.Mixed,
    method: String,
    params: Schema.Types.Mixed,
    protocol: String,
    query: Schema.Types.Mixed,
    routerPath: String,
    url: String,
    validationError: Schema.Types.Mixed,
  },
  { _id: false, timestamps: false },
);

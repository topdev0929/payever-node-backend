import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const DataSchemaName: string = 'Data';

export const DataSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    data: Schema.Types.Mixed,
    expiresAt: { type: Schema.Types.Date, required: false },
    file: String,
  },
  {
    timestamps: { },
  },
)
  .index({ expiresAt: 1 }, { sparse: true });

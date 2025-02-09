import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const RecordSchemaName: string = 'Record';

export const RecordSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    data: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { },
  },
);

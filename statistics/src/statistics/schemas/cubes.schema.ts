import { Schema } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
export const CubeSchemaName: string = 'Cube';
export const CubeSchema: Schema = new Schema(
  {
    _id: {
      default: uuidV4,
      type: Schema.Types.String,
    },
    code: {
      type: String,
    },
    enabled: {
      type: Schema.Types.Boolean,
    },
    name: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: { },
  },
);

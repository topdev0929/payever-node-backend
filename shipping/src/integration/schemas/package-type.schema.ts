import { Schema } from 'mongoose';

export const PackageTypeSchema: Schema = new Schema(
  {
    code: {
      required: true,
      type: Schema.Types.String,
    },
    displayName: {
      required: true,
      type: Schema.Types.String,
    },
  },
);

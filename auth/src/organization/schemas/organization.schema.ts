import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const OrganizationSchemaName: string = 'Organization';
export const OrganizationSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    businesses: [{
      type: Schema.Types.String,
    }],
    name: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: { },
  },
);

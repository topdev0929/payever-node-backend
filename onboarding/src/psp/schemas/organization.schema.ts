import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const OrganizationSchemaName: string = 'Organization';
export const OrganizationSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    clientId: {
      default: uuid,
      required: true,
      type: Schema.Types.String,
    },
    clientSecret: {
      default: uuid,
      required: true,
      type: Schema.Types.String,
    },
    name: {
      type: Schema.Types.String,
    },

    businesses: {
      default: [],
      type: [String],
    },
  },
  {
    timestamps: { },
  },
);

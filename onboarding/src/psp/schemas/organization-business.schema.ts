import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const OrganizationBusinessSchemaName: string = 'OrganizationBusiness';
export const OrganizationBusinessSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: Schema.Types.String,
    },
    businessId: {
      required: true,
      type: Schema.Types.String,
    },
    organizationId: {
      required: true,
      type: Schema.Types.String,
    },
  },
  {
    timestamps: { },
  },
);

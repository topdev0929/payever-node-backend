import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { OwnerSchema } from './owner.schema';

export const SpotlightSchemaName: string = 'Spotlight';
export const SpotlightSchema: Schema = new Schema(
  {
    _id: { default: uuid, type: String },
    app: String,
    businessId: { default: null, type: String },
    currency: String,
    description: String,
    icon: String,
    owner: OwnerSchema,
    ownerId: String,
    salt: String,
    serviceEntityId: String,
    subType: String,
    title: String,
    contact: [String],
  },
);

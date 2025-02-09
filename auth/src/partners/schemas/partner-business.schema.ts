import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { PartnerTagName } from '@pe/nest-kit';

export const PartnerBusinessSchemaName: string = 'PartnerBusiness';

export const PartnerBusinessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    partnerTags: [{ type: String, enum: Object.values(PartnerTagName)}],
  },
  {
    collection: 'partner-businesses',
  },
);

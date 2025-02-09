import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import * as mongooseIdPlugin from 'mongoose-id';
import { BusinessSchemaName, CampaignSchemaName } from '../../mongoose-schema/mongoose-schema.names';

export const StatSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    bounce: Number,
    business: {
      ref: BusinessSchemaName,
      required: true,
      type: String,
    },
    campaign: {
      ref: CampaignSchemaName,
      required: true,
      type: String,
    },
    click: Number,
    open: Number,
  },
  { timestamps: true },
)
;

StatSchema.plugin(mongooseIdPlugin);

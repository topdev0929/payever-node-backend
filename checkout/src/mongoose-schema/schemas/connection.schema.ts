import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName, IntegrationSchemaName } from '../schema-names';

export const ConnectionSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.String, default: uuid },
    businessId: { type: Schema.Types.String, required: true },
    integration: { type: Schema.Types.String, required: true, ref: IntegrationSchemaName },

    name: { type: Schema.Types.String },
    options: { default: { }, type: Schema.Types.Mixed },

    mappedReference: { type: Schema.Types.String },

    isBpoActive: { type: Schema.Types.Boolean },
  },
  {
    timestamps: {

    },
    toJSON: { depopulate: true, virtuals: true },
    toObject: { depopulate: true, virtuals: true },
  },
)
  .index({ businessId: 1 });

ConnectionSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});

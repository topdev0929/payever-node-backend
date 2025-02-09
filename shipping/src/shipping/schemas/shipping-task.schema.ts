import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName } from '../../business';
import { IntegrationSchemaName } from '../../integration';
import { SyncEventSchema } from './sync-event.schema';

export const ShippingTaskSchemaName: string = 'ShippingTask';

export const ShippingTaskSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    kind: String,

    businessId: { type: Schema.Types.String, required: true },
    integration: { type: Schema.Types.String, required: false, ref: IntegrationSchemaName },

    errorsList: [{ sku: String, messages: [String] }],

    direction: String,
    finishedAt: Date,
    status: String,

    events: { type: [SyncEventSchema], select: false },
    failureReason: { type: Schema.Types.Mixed },
    itemsSynced: Number,
    startedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ShippingTaskSchema.index({ 'startedAt': 1});
ShippingTaskSchema.index({ businessId: 1, integration: 1 });

ShippingTaskSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});

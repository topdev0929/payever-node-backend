import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName } from '@pe/business-kit';
import { IntegrationSchemaName } from '@pe/synchronizer-kit';

export const SynchronizationSchemaName: string = 'Synchronization';

export const SynchronizationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businessId: { type: Schema.Types.String, required: true },
    integrationId: { type: Schema.Types.String, required: true },

    isInwardEnabled: { type: Boolean, default: false },
    isOutwardEnabled: { type: Boolean, default: false },

    lastSynced: Date,
  },
  {
    timestamps: true,
  },
);

SynchronizationSchema.index(
  {
    businessId: 1,
    integrationId: 1,
  },
  {
    unique: true,
  },
);

SynchronizationSchema.virtual('business', {
  ref: BusinessSchemaName,
  localField: 'businessId',
  foreignField: '_id',
  justOne: true,
});

SynchronizationSchema.virtual('integration', {
  ref: IntegrationSchemaName,
  localField: 'integrationId',
  foreignField: '_id',
  justOne: true,
});

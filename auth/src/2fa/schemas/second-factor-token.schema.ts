import { Schema } from 'mongoose';

export const SecondFactorTokenSchemaName: string = 'SecondFactorToken';

export const SecondFactorTokenSchema: Schema = new Schema(
  {
    active: { type: Boolean, default: true, required: true },
    code: { type: Number, required: true },
    createdAt: { type: Date, expires: 600, default: Date.now },
    userId: { type: String, required: true },
  },
  {
    autoIndex: true,
    collection: 'second-factor-tokens',
  },
)
  .index({ userId: 1 })
  .index({ userId: 1, code: 1, active: 1 });

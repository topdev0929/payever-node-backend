import { Schema, VirtualType } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const CustomAccessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    access: {
      enum: ['Editor', 'Viewer'],
      required: true,
      type: String,
    },
    application: { type: Schema.Types.String, required: true },
    business: { type: Schema.Types.String },
    theme: { type: Schema.Types.String },
    urls: [String],
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
  },
)
  .index({ application: 1 })
  .index({ access: 1, application: 1  }, { unique: true });

CustomAccessSchema.virtual('id').get(function (): VirtualType {
  return this._id;
});

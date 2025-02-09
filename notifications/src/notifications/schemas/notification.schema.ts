import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const NotificationSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    app: { type: String, required: true },
    entity: { type: String, required: true },
    kind: { type: String, required: true },

    hash: { type: String, required: true },
    message: { type: String, required: true },

    data: { type: Object, default: { } },
  },
  {
    timestamps: { },
  },
)

  .index({ hash: 1 })
  .index({ kind: 1, entity: 1 })
  .index({ kind: 1, entity: 1, app: 1 })
  .index({ kind: 1, entity: 1, message: 1 })
  ;

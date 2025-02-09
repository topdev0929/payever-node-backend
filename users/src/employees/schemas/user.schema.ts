import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const UserSchemaName: string = 'UserModel';

export const UserSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businesses: [{
      ref: 'Business',
      type: String,
    }],
  },
  {
    collection: 'users',
    timestamps: { },

  },
)
  .index({ business: 1 })
  .index({ businesses: 1 });

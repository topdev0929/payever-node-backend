import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { ScopesEnum } from '../../common';

export const OAuthClientSchemaName: string = 'OAuthClient';

export const OAuthClientSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    businesses: { type: [String], required: true },
    name: { type: String },
    organization: { type: String },
    redirectUri: { type: String },
    secret: { type: String, required: true },
    user: { type: Schema.Types.String, ref: 'User' },

    accessTokenLifetime: { type: Number, default: 3600 },
    grants: {
      default: ['http://www.payever.de/api/payment'],
      required: true,
      type: [String],
    },
    isActive: { type: Boolean, default: true, index: true },
    refreshTokenLifetime: { type: Number, default: 1209600 },
    scopes: {
      default: ['API_CREATE_PAYMENT'],
      enum: Object.values(ScopesEnum),
      type: [String],
    },
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
  },
)
  .index({ business: 1 })
  .index({ business: 1, _id: 1 })
  .index({ _id: 1, secret: 1 });

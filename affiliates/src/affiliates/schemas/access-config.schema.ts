import { v4 as uuid } from 'uuid';
import { Schema } from 'mongoose';
import { BusinessSchemaName } from '@pe/business-kit';
import { AccessConfigModel } from '../models';
import { AffiliateBrandingSchemaName } from './affiliate-branding.schema';

export const AccessConfigSchemaName: string = 'AccessConfig';
export const AccessConfigSchema: Schema<AccessConfigModel> 
= new Schema<AccessConfigModel>(
  {
    _id: {
      default: uuid,
      type: String,
    },
    affiliateBranding: { type: String, ref: AffiliateBrandingSchemaName },
    business: {
      ref: BusinessSchemaName,
      required: true,
      type: String,
    },
    internalDomain: {
      type: String,
    },
    internalDomainPattern: {
      type: String,
    },
    isLive: {
      default: false,
      type: Boolean,
    },
    isLocked: {
      default: false,
      type: Boolean,
    },
    isPrivate: {
      default: false,
      type: Boolean,
    },
    ownDomain: String,
    privateMessage: String,
    privatePassword: {
      type: String,
    },
    socialImage: {
      type: String,
    },
    version: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc: any, ret: any) => { delete ret.privatePassword; },
    },
    toObject: {
      transform: (doc: any, ret: any) => { delete ret.privatePassword; },
    },
  });


import { Schema } from 'mongoose';
import { DomainModel } from '../models';
import { v4 as uuid } from 'uuid';
import { AffiliateBrandingSchemaName } from '.';

export const DomainSchemaName: string = 'Domain';
export const DomainSchema: Schema<DomainModel> = new Schema<DomainModel>(
  {
    _id: {
      default: uuid,
      required: true,
      type: String,
    },
    isConnected: {
      default: false,
      required: true,
      type: Boolean,
    },
    name: {
      index: true,
      required: true,
      type: String,
      unique: true,
    },

    affiliateBranding: {
      index: true,
      ref: AffiliateBrandingSchemaName,
      required: true,
      type: String,
    },
  }, 
  {
    timestamps: true,
  },
);

DomainSchema.index(
  {
    name: 1,
  }, 
  {
    unique: true,
  },
);

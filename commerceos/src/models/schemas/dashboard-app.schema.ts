import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { accessSchema } from './dashboard-app/access.schema';

export const AclSchema: Schema = new Schema({
  aclCreate: { type: Boolean, required: true },
  aclDelete: { type: Boolean, required: true },
  aclRead: Boolean,
  aclUpdate: Boolean,
});

export const dashboardAppSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    access: {
      admin: accessSchema,
      business: accessSchema,
      partner: accessSchema,
      user: accessSchema,
    },
    allowedAcls: {
      create: { type: Boolean, required: true },
      delete: { type: Boolean, required: true },
      read: Boolean,
      update: Boolean,
    },
    bootstrapScriptUrl: String,
    businessTypes: [String],
    code: {
      required: true,
      type: String,
    },
    dashboardInfo: {
      icon: String,
      title: String,
    },
    order: Number,
    platformHeader: {
      bootstrapScriptUrl: String,
      tag: String,
    },
    tag: String,
    version: String,
  },
  {
    collection: 'dashboardapps',
    timestamps: true,
  },
);

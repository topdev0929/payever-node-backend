import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const AppSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    code: {
      required: true,
      type: String,
    },
    version: String,

    access: {
      admin: {
        defaultInstalled: {
          default: false,
          type: Boolean,
        },
        isDefault: {
          default: false,
          type: Boolean,
        },
        url: String,
      },
      business: {
        defaultInstalled: {
          default: false,
          type: Boolean,
        },
        isDefault: {
          default: false,
          type: Boolean,
        },
        url: String,
      },
      partner: {
        defaultInstalled: {
          default: false,
          type: Boolean,
        },
        isDefault: {
          default: false,
          type: Boolean,
        },
        url: String,
      },
      user: {
        defaultInstalled: {
          default: false,
          type: Boolean,
        },
        isDefault: {
          default: false,
          type: Boolean,
        },
        url: String,
      },
    },
    bootstrapScriptUrl: String,
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
  },
  {
    timestamps: true,
  },
)
  .index({ code: 1 })
  .index({ code: 1, version: 1 }, { unique: true });

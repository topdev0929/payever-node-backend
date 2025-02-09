import { Schema, VirtualType } from 'mongoose';
import { v4 as uuid } from 'uuid';
import * as mongooseIdPlugin from 'mongoose-id';
import {
  BusinessSchemaName,
  CategorySchemaName,
  ScheduleSchemaName,
} from '../../mongoose-schema/mongoose-schema.names';

const  attachmentSchema: Schema = new Schema(
  {
    cid: String,
    content: String,
    encoding: String,
    filename: String,
  },
  { _id : false },
);

export const CampaignSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    attachments: [attachmentSchema],
    business: {
      ref: BusinessSchemaName,
      required: true,
      type: String,
    },
    categories: [{ type: String, ref: CategorySchemaName }],
    channelSet: {
      required: true,
      type: String,
    },
    contacts: {
      required: false,
      type: Array,
    },
    date: {
      required: true,
      type: Date,
    },
    from: {
      required: false,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    preview: {
      required: false,
      type: String,
    },
    productIds: {
      required: false,
      type: Array,
    },
    schedules: [{
      ref: ScheduleSchemaName,
      type: String,
    }],
    status: {
      required: true,
      type: String,
    },
    template: {
      required: false,
      type: String,
    },
    theme: {
      required: false,
      type: String,
    },
    themeId: {
      required: false,
      type: String,
    },
  },
  { timestamps: true },
)

  .index({ channelSet: 1 })
  .index({ business: 1 })
  ;

CampaignSchema.virtual('id').get(function (): VirtualType {
  return this._id;
});

CampaignSchema.plugin(mongooseIdPlugin);

import { Schema } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import { BusinessSchemaName } from '../../business/schemas';
import { ChannelSetSchemaName } from '../../channel-set';
import { PostSentStatusEnum, PoststatusEnum, PostTypeEnum } from '../enums';
import { MediaSchema } from './media.schema';
import { PostStateSchema } from './post-state.schema';

export const PostSchemaName: string = 'Post';
export const PostSchema: Schema = new Schema(
  {
    _id: {
      default: uuidV4,
      type: Schema.Types.String,
    },
    attachments: [MediaSchema],
    businessId: {
      index: true,
      required: true,
      type: Schema.Types.String,
    },
    channelSet: [{
      index: true,
      ref: ChannelSetSchemaName,
      required: true,
      type: Schema.Types.String,
    }],
    content: { type: Schema.Types.String },
    failedIntegrations: [{ type: String }],
    media: [{ type: Schema.Types.String }],
    mediaType: { type: Schema.Types.String },
    parentFolderId: { type: Schema.Types.String },
    postState: [PostStateSchema],
    postedAt: { type: Schema.Types.Date, required: false },
    productId: [{ type: Schema.Types.String }],
    sentStatus: { type: PostSentStatusEnum },
    status: { type: PoststatusEnum },
    title: { type: Schema.Types.String },
    toBePostedAt: { type: Schema.Types.Date, required: false },
    type: { type: PostTypeEnum },
  },
  {
    timestamps: { },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

PostSchema.virtual('business', {
  foreignField: '_id',
  justOne: true,
  localField: 'businessId',
  ref: BusinessSchemaName,
});

import { Schema, Document } from 'mongoose';
import {
  MessagingTypeEnum,
  CommonChannelInterface,
  MessagingIntegrationsEnum,
} from '@pe/message-kit';
import { SchemaFactory, Schema as SchemaDecorator, Prop } from '@nestjs/mongoose';

import { ChannelTypeEnum } from '../../../../enums';
import {
  AbstractChannel,
  AbstractMessaging,
  AbstractMessagingDocument,
  AbstractChatMessageEmbeddedDocument,
  PermissionsSchema,
  Permissions,
  PermissionsEmbeddedDocument,
} from '../../../platform';
import { PinnedEmbeddedDocument } from '../../../platform/schemas/pinned.schema';

@SchemaDecorator({
  collection: 'chats',
  discriminatorKey: 'type',
  timestamps: true,
})
export class CommonChannel extends AbstractChannel implements CommonChannelInterface {
  @Prop({
    index: true,
    required: false,
  })
  public business?: string;

  @Prop({
    default: null,
    index: true,
    required: false,
  })
  public email?: string;

  @Prop({
    enum: Object.values(MessagingIntegrationsEnum),
    index: true,
    required: true,
    type: String,
  })
  public integrationName: MessagingIntegrationsEnum;

  @Prop({
    index: {
      sparse: true,
      unique: true,
    },
  })
  public slug?: string;

  //  replace by visibility
  @Prop({
    enum: ChannelTypeEnum,
    type: String,
  })
  public subType: ChannelTypeEnum;

  @Prop({
    index: true,
  })
  public usedInWidget?: boolean;

  @Prop({
    type: [String],
  })
  public contacts: string[];

  @Prop({
    type: PermissionsSchema,
  })
  public permissions: Permissions;

  public readonly type: MessagingTypeEnum.Channel | MessagingTypeEnum.Email;

  public static isTypeOf(chat: AbstractMessaging): chat is CommonChannel;
  public static isTypeOf(chat: AbstractMessagingDocument): chat is CommonChannelDocument {
    return chat.type === MessagingTypeEnum.Channel || chat.type === MessagingTypeEnum.Email;
  }

  public createdAt?: Date;
}

export interface CommonChannelDocument extends Document<string>, CommonChannel {
  _id: string;
  lastMessages?: AbstractChatMessageEmbeddedDocument[];
  pinned?: PinnedEmbeddedDocument[];
  permissions: PermissionsEmbeddedDocument;
}

export const CommonChannelSchema: Schema<CommonChannelDocument> = SchemaFactory.createForClass(CommonChannel);

CommonChannelSchema.index({
  subType: 1,
});

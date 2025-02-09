import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { MessagingIntegrationsEnum, ChatMemberRoleEnum, MessagingTypeEnum } from '@pe/message-kit';

import { ChatInviteDocument } from '../../src/message/submodules/invites';
import { CommonChannelDocument, CommonChannel } from '../../src/message/submodules/messaging/common-channels';
import {
  ID_OF_USER_1,
  ID_OF_INTEGRATION_CHANNEL_1,
  ID_OF_EXISTING_BUSINESS,
  SALT,
  ID_OF_FOLDER_1,
} from './const';
import { AddMemberMethodEnum } from '../../src/message';

class IntegrationChannelFixture extends BaseFixture {
  protected readonly integrationChannelChatModel: Model<CommonChannelDocument> =
    this.application.get(getModelToken(CommonChannel.name));
  protected readonly chatInviteModel: Model<ChatInviteDocument> = this.application.get(`ChatInviteModel`);

  public async apply(): Promise<void> {
    await this.integrationChannelChatModel.create({
      _id: ID_OF_INTEGRATION_CHANNEL_1,
      business: ID_OF_EXISTING_BUSINESS,
      deleted: false,
      expiresAt: null,
      integrationName: MessagingIntegrationsEnum.Internal,
      lastMessages: [],
      members: [{
        user: ID_OF_USER_1,
        role: ChatMemberRoleEnum.Admin,
        addMethod: AddMemberMethodEnum.OWNER,
        addedBy: ID_OF_USER_1,
      }],
      salt: SALT,
      title: 'Public integration channel',
      type: MessagingTypeEnum.Channel,
      description: '',
      photo: '',
      signed: false,
      permissions: {
        live: true,
      },
      usedInWidget: true,
    });
  }
}

export = IntegrationChannelFixture;

import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import {
  ChatMemberRoleEnum,
  MessagingTypeEnum,
} from '@pe/message-kit';

import { SupportChannelDocument, SupportChannel } from '../../src/message/submodules/messaging/support-channels';
import {
  ID_OF_BUSINESS_2,
  ID_OF_SUPPORT_CHANNEL_1, ID_OF_SUPPORT_CHANNEL_2, SALT,
} from './const';

class SupportChannelFixture extends BaseFixture {
  protected readonly supportChannelModel: Model<SupportChannelDocument> =
    this.application.get(getModelToken(SupportChannel.name));
  public async apply(): Promise<void> {
    await this.supportChannelModel.create({
      _id: ID_OF_SUPPORT_CHANNEL_1,
      business: null,
      description: '',
      photo: '',
      salt: SALT,
      signed: false,
      members: [],
      removedMembers: [],
      title: 'Merchant onboarding support channel',
      type: MessagingTypeEnum.SupportChannel,
    });

    await this.supportChannelModel.create({
      _id: ID_OF_SUPPORT_CHANNEL_2,
      business: ID_OF_BUSINESS_2,
      description: '',
      photo: '',
      salt: SALT,
      signed: false,
      members: [],
      removedMembers: [],
      title: 'Support channel 2',
      type: MessagingTypeEnum.SupportChannel,
    });
  }
}

export = SupportChannelFixture;

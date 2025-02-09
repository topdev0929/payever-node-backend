import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMemberRoleEnum, ChatMemberStatusEnum, MessagingIntegrationsEnum } from '@pe/message-kit';

import { ProfileDocument, Profile } from '../../src/message';
import { UserDocument } from '../../src/projections/models';
import { AddMemberMethodEnum, StatusEnum } from '../../src/message/enums';
import {
  ID_OF_USER_1,
  ID_OF_EXISTING_BUSINESS,
  ID_OF_USER_2,
  ID_OF_USER_3,
  ID_OF_USER_4,
  USERNAME_OF_USER_1,
  ID_OF_USER_6,
  ID_OF_BUSINESS_2,
  ID_OF_BUSINESS_3,
  ID_OF_USER_7,
  ID_OF_USER_5,
  USER_5_EMAIL,
  ID_OF_CONTACT,
  SALT,
} from './const';
import { CustomerChat, CustomerChatDocument } from '../../src/message/submodules/messaging/customer-chat';

class UserWithManyBusinessesFixture extends BaseFixture {
  protected readonly userModel: Model<UserDocument> =
    this.application.get(`UserModel`);
  protected readonly profileModel: Model<ProfileDocument> =
    this.application.get(getModelToken(Profile.name));
  protected readonly customerChatModel: Model<CustomerChatDocument> =
    this.application.get(getModelToken(CustomerChat.name));
  public async apply(): Promise<void> {
    const totalBusinessesCount: number = 1000;
    const businesses: string[] = [];
    for (let i = 0; i < totalBusinessesCount; i++) {
      const businessId: string = `business-id-${i}`;
      businesses.push(businessId);

      await this.customerChatModel.create({
        _id: `chat-for-business-${i}`,
        title: 'chat for business ${i}',
        business: businessId,
        contact: ID_OF_CONTACT,
        salt: SALT,
        deleted: false,
        expiresAt: null,
        integrationName: MessagingIntegrationsEnum.WhatsApp,
        pinned: [],
        lastMessages: [],
        members: [{
          user: ID_OF_USER_1,
          role: ChatMemberRoleEnum.Admin,
          addMethod: AddMemberMethodEnum.INCLUDE,
          addedBy: ID_OF_USER_1,
        }],
      });
    }

    await this.userModel.findOneAndUpdate(
      { _id: ID_OF_USER_1 },
      { $set: { businesses } },
    );
  }
}

export = UserWithManyBusinessesFixture;

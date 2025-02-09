import { FilterQuery, Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MessagingTypeEnum, MessagingIntegrationsEnum } from '@pe/message-kit';

import { CustomerChat, CustomerChatDocument } from '../schemas';
import { AbstractMessaging, BaseMessagingService, ChatMember, MessagingTypeService } from '../../../platform';
import { InternalEventCodesEnum } from '../../../../../common';
import { GetMessagingFilterContextInterface, GetMessagingMembersFilterContextInterface } from '../../../../interfaces';
import { UserDocument } from '../../../../../projections/models';

@MessagingTypeService()
@Injectable()
export class CustomerChatService extends BaseMessagingService<CustomerChatDocument> {
  protected readonly allowedIntegrations: MessagingIntegrationsEnum[] = [
    MessagingIntegrationsEnum.WhatsApp,
    MessagingIntegrationsEnum.FacebookMessenger,
    MessagingIntegrationsEnum.InstagramMessenger,
    MessagingIntegrationsEnum.LiveChat,
    MessagingIntegrationsEnum.Telegram,
    MessagingIntegrationsEnum.Email,
  ];
  constructor(
    @InjectModel(CustomerChat.name)
    chatModel: Model<CustomerChatDocument>,
  ) {
    super(chatModel, {
      created: InternalEventCodesEnum.ChatCreated,
      deleted: InternalEventCodesEnum.ChatDeleted,
      updated: InternalEventCodesEnum.ChatUpdated,
    });
  }

  public getMessagingFilter(context: GetMessagingFilterContextInterface): FilterQuery<CustomerChatDocument> {
    const businessIds: string[] = [...context.businessIds || [], context.business?._id].filter((id: string) => !!id);

    return {
      business: businessIds.length === 1 ? businessIds[0] : { $in: context.businessIds },
      type: MessagingTypeEnum.CustomerChat,
    };
  }

  public isServiceOf(chat: AbstractMessaging): boolean {
    return CustomerChat.isTypeOf(chat);
  }

  public getMembersFilter(context: GetMessagingMembersFilterContextInterface): FilterQuery<UserDocument> {
    return {
      _id: {
        $in: context.chat.members.map(
          (member: ChatMember) => member.user,
        ),
      },
    };
  }
}

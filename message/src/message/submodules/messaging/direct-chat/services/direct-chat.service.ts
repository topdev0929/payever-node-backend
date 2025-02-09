import { FilterQuery, Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DirectChat, DirectChatDocument } from '../schemas';
import { AbstractMessaging, BaseMessagingService, ChatMember, MessagingTypeService } from '../../../platform';
import { InternalEventCodesEnum } from '../../../../../common';
import { GetMessagingFilterContextInterface, GetMessagingMembersFilterContextInterface } from '../../../../interfaces';
import { MessagingTypeEnum, MessagingIntegrationsEnum } from '@pe/message-kit';
import { UserDocument } from 'src/projections/models';

@MessagingTypeService()
@Injectable()
export class DirectChatService extends BaseMessagingService<DirectChatDocument> {
  protected readonly allowedIntegrations: MessagingIntegrationsEnum[] = null;
  constructor(
    @InjectModel(DirectChat.name)
    chatModel: Model<DirectChatDocument>,
  ) {
    super(chatModel, {
      created: InternalEventCodesEnum.ChatCreated,
      deleted: InternalEventCodesEnum.ChatDeleted,
      updated: InternalEventCodesEnum.ChatUpdated,
    });
  }

  public getMessagingFilter(context: GetMessagingFilterContextInterface): FilterQuery<DirectChatDocument> {
    return {
      'members.user': context.userToken.id,
      type: MessagingTypeEnum.DirectChat,
    };
  }

  public isServiceOf(chat: AbstractMessaging): boolean {
    return DirectChat.isTypeOf(chat);
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

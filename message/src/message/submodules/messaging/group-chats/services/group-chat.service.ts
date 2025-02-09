import { FilterQuery, Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MessagingTypeEnum,
  MessagingIntegrationsEnum,
} from '@pe/message-kit';

import { AbstractMessaging, BaseMessagingService, ChatMember, MessagingTypeService } from '../../../platform';
import { GroupChatDocument, GroupChat } from '../schemas';
import { InternalEventCodesEnum } from '../../../../../common';
import { GetMessagingFilterContextInterface, GetMessagingMembersFilterContextInterface } from '../../../../interfaces';
import { UserDocument } from '../../../../../projections/schema';

@MessagingTypeService()
@Injectable()
export class GroupChatService extends BaseMessagingService<GroupChatDocument> {
  protected readonly allowedIntegrations: MessagingIntegrationsEnum[] = null;

  constructor(
    @InjectModel(GroupChat.name)
    groupChatModel: Model<GroupChatDocument>,
  ) {
    super(groupChatModel, {
      created: InternalEventCodesEnum.ChatCreated,
      deleted: InternalEventCodesEnum.ChatDeleted,
      updated: InternalEventCodesEnum.ChatUpdated,
    });
  }

  public getMessagingFilter(context: GetMessagingFilterContextInterface): FilterQuery<GroupChatDocument> {
    const businessIds: string[] = [...context.businessIds || [], context.business?._id].filter((id: string) => !!id);

    return {
      $or: [
        {
          business: businessIds.length === 1 ? businessIds[0] : { $in: context.businessIds },
          subType: 'support',
        },
        {
          subType: {
            $ne: 'support',
          },
        },
      ],
      members: {
        $elemMatch: {
          user: context.userToken.id,
        },
      },
      type: MessagingTypeEnum.Group,
    };
  }

  public isServiceOf(chat: AbstractMessaging): boolean {
    return GroupChat.isTypeOf(chat);
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

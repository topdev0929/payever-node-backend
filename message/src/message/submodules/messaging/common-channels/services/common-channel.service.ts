import { FilterQuery, DocumentDefinition, UpdateQuery, Model } from 'mongoose';

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CommonChannel, CommonChannelDocument } from '../schemas';
import { AbstractMessaging, BaseMessagingService, ChatMember, MessagingTypeService } from '../../../platform';
import { InternalEventCodesEnum } from '../../../../../common';
import { GetMessagingFilterContextInterface, GetMessagingMembersFilterContextInterface } from '../../../../interfaces';
import { ChannelTypeEnum, EventOriginEnum } from '../../../../enums';
import {
  ChatMemberRoleEnum,
  MessagingTypeEnum,
  MessagingIntegrationsEnum,
} from '@pe/message-kit';
import { UserDocument } from '../../../../../projections/schema';

@MessagingTypeService()
@Injectable()
export class CommonChannelService extends BaseMessagingService<CommonChannelDocument> {
  protected readonly allowedIntegrations: MessagingIntegrationsEnum[] = [
    MessagingIntegrationsEnum.Email,
    MessagingIntegrationsEnum.Internal,
  ];

  constructor(
    @InjectModel(CommonChannel.name)
    channelChatModel: Model<CommonChannelDocument>,
  ) {
    super(channelChatModel, {
      created: InternalEventCodesEnum.ChatCreated,
      deleted: InternalEventCodesEnum.ChatDeleted,
      updated: InternalEventCodesEnum.ChatUpdated,
    });
  }

  public async create(
    data: DocumentDefinition<CommonChannelDocument>,
    eventSource: EventOriginEnum,
  ): Promise<CommonChannelDocument> {
    await this.checkSlugAvailable(data.slug);

    return super.create(data, eventSource);
  }

  public async update(
    data: UpdateQuery<CommonChannelDocument>,
    eventSource: EventOriginEnum,
  ): Promise<CommonChannelDocument> {
    await this.checkSlugAvailable(data.slug);

    return super.update(data, eventSource);
  }

  public getMessagingFilter(context: GetMessagingFilterContextInterface): FilterQuery<CommonChannelDocument> {
    const businessIds: string[] = [...context.businessIds || [], context.business?._id].filter((id: string) => !!id);

    return {
      $or: [
        {
          subType: ChannelTypeEnum.Public,
        },
        {
          business: businessIds.length === 1 ? businessIds[0] : { $in: context.businessIds },
        },
      ],
      'members.user': context.userToken.id,
      type: MessagingTypeEnum.Channel,
    };
  }

  public isServiceOf(chat: AbstractMessaging): boolean {
    return CommonChannel.isTypeOf(chat);
  }

  public getMembersFilter(context: GetMessagingMembersFilterContextInterface): FilterQuery<UserDocument> {
    const userMember: ChatMember = CommonChannel.getMemberOfUser(context.chat, context.user.id);

    return {
      _id: {
        $in: context.chat.members
          .filter(
            (member: ChatMember) => {
              if (!userMember) {
                return false;
              }
              if (userMember.role === ChatMemberRoleEnum.Subscriber) {
                return false;
              }
              if (userMember.role === ChatMemberRoleEnum.Admin) {
                return true;
              }

              return [
                ChatMemberRoleEnum.Admin,
                ChatMemberRoleEnum.Member,
              ].includes(member.role);
            },
          )
          .map(
            (member: ChatMember) => member.user,
          ),
      },
    };
  }

  private async checkSlugAvailable(slug: string): Promise<void> {
    if (!slug) {
      return;
    }
    const channelWithSameSlug: CommonChannelDocument = await this.findOne({
      slug: slug,
      type: MessagingTypeEnum.Channel,
    });
    if (channelWithSameSlug) {
      throw new BadRequestException(`Channel with slug "${slug}" exists`);
    }
  }
}

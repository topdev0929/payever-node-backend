import { FilterQuery, Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { MessagingTypeEnum, MessagingIntegrationsEnum } from '@pe/message-kit';

import { SupportChannel, SupportChannelDocument } from '../schemas';
import { InternalEventCodesEnum } from '../../../../../common';
import { GetMessagingFilterContextInterface, GetMessagingMembersFilterContextInterface } from '../../../../interfaces';
import { AbstractMessaging, BaseMessagingService, MessagingTypeService } from '../../../platform';
import { UserDocument } from '../../../../../projections/models';

@MessagingTypeService()
@Injectable()
export class SupportChannelService extends BaseMessagingService<SupportChannelDocument> {
  protected readonly allowedIntegrations: MessagingIntegrationsEnum[] = null;
  constructor(
    @InjectModel(SupportChannel.name)
    internalChatModel: Model<SupportChannelDocument>,
  ) {
    super(internalChatModel, {
      created: InternalEventCodesEnum.ChatCreated,
      deleted: InternalEventCodesEnum.ChatDeleted,
      updated: InternalEventCodesEnum.ChatUpdated,
    });
  }

  public getMessagingFilter(context: GetMessagingFilterContextInterface): FilterQuery<SupportChannelDocument> {
    return {
      type: MessagingTypeEnum.SupportChannel,
    };
  }

  public isServiceOf(chat: AbstractMessaging): boolean {
    return SupportChannel.isTypeOf(chat);
  }

  public getMembersFilter(context: GetMessagingMembersFilterContextInterface): FilterQuery<UserDocument> {
    return null;
  }
}

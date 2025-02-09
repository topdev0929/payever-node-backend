import { FilterQuery, Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { MessagingTypeEnum, MessagingIntegrationsEnum } from '@pe/message-kit';

import { AbstractMessaging, BaseMessagingService, MessagingTypeService } from '../../../platform';
import { AppChannel, AppChannelDocument } from '../schemas';
import { InternalEventCodesEnum } from '../../../../../common';
import { GetMessagingFilterContextInterface, GetMessagingMembersFilterContextInterface } from '../../../../interfaces';
import { UserDocument } from '../../../../../projections/models';

@MessagingTypeService()
@Injectable()
export class AppChannelService extends BaseMessagingService<AppChannelDocument> {
  protected readonly allowedIntegrations: MessagingIntegrationsEnum[] = null;

  constructor(
    @InjectModel(AppChannel.name)
    appChannelChatModel: Model<AppChannelDocument>,
  ) {
    super(appChannelChatModel, {
      created: InternalEventCodesEnum.ChatCreated,
      deleted: InternalEventCodesEnum.ChatDeleted,
      updated: InternalEventCodesEnum.ChatUpdated,
    });
  }

  public getMessagingFilter(context: GetMessagingFilterContextInterface): FilterQuery<AppChannelDocument> {
    const businessIds: string[] = [...context.businessIds || [], context.business?._id].filter((id: string) => !!id);

    return {
      business: businessIds.length === 1 ? businessIds[0] : { $in: context.businessIds },
      type: MessagingTypeEnum.AppChannel,
    };
  }

  public getMembersFilter(context: GetMessagingMembersFilterContextInterface): FilterQuery<UserDocument> {
    return { _id: { $in: [] } };
  }

  public isServiceOf(chat: AbstractMessaging): boolean {
    return AppChannel.isTypeOf(chat);
  }
}

import { Model } from 'mongoose';

import { Inject } from '@nestjs/common';

import { UserTokenInterface, UserRoleMerchant, RolesEnum, UserRoleInterface, EventDispatcher } from '@pe/nest-kit';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special/business-access.validator';

import { InjectModel } from '@nestjs/mongoose';

import {
  AbstractMessaging,
  AbstractMessagingDocument,
  Permissions,
  PermissionsEmbeddedDocument,
  CommonMessagingService,
} from '../submodules/platform';
import { EventOriginEnum, ChannelTypeEnum } from '../enums';
import { UserDocument, UsersService } from '../../projections';
import { InternalEventCodesEnum } from '../../common';

export class PermissionsService {
  @InjectModel(AbstractMessaging.name) private readonly model: Model<AbstractMessagingDocument>;
  @Inject() private readonly commonMessagingService: CommonMessagingService;
  @Inject() private readonly userService: UsersService;
  @Inject() protected readonly eventDispatcher: EventDispatcher;

  public static hasUserTokenAccessToBusiness(userToken: UserTokenInterface, businessId: string): boolean {
    const userRoleMerchantRole: UserRoleMerchant = userToken.roles?.find(
      (role: UserRoleInterface) => role.name === RolesEnum.merchant,
    ) as UserRoleMerchant;
    if (!userRoleMerchantRole) {
      return false;
    }
    const userRoleAdminRole: UserRoleInterface = userToken.roles?.find(
      (role: UserRoleInterface) => role.name === RolesEnum.admin,
    );

    return BusinessAccessValidator.isAccessAllowed(
      userRoleMerchantRole,
      [{
        action: 'create',
        microservice: 'message',
      }],
      businessId,
    ) || Boolean(userRoleAdminRole);
  }

  public async updateMessagingPermissions(
    chat: AbstractMessaging & { permissions: PermissionsEmbeddedDocument },
    changes: Partial<Permissions> & { publicView?: boolean; live?: boolean },
    eventSource: EventOriginEnum,
  ): Promise<AbstractMessagingDocument> {
    if ('live' in changes) {
      await this.model.findOneAndUpdate(
        {
          _id: chat._id,
          type: chat.type,
        },
        {
          $set: {
            permissions: {
              live: changes.live,
            },
          },
        },
      );
    }

    if ('publicView' in changes) {
      await this.model.findOneAndUpdate(
        {
          _id: chat._id,
          type: chat.type,
        },
        {
          $set: {
            subType: changes.publicView ? ChannelTypeEnum.Public : ChannelTypeEnum.Private,
          },
        },
      );
    }

    if ('sendMessages' in changes) {
      for (const member of chat.members) {
        const user: UserDocument = await this.userService.findById(member.user);
        await this.commonMessagingService.updateMember(
          chat,
          user,
          {
            permissions: {
              sendMessages: changes.sendMessages,
            },
            role: member.role,
          },
        );
      }
    }

    if ('sendMedia' in changes) {
      for (const member of chat.members) {
        const user: UserDocument = await this.userService.findById(member.user);
        await this.commonMessagingService.updateMember(
          chat,
          user,
          {
            permissions: {
              sendMedia: changes.sendMedia,
            },
            role: member.role,
          },
        );
      }
    }

    const updatedChat: AbstractMessagingDocument = await this.model.findOneAndUpdate(
      {
        _id: chat._id,
        type: chat.type,
      },
      {
        $set: {
          permissions: {
            ...chat.permissions?.toObject(),
            ...changes,
          },
        },
      },
      {
        new: true,
      },
    );

    await this.eventDispatcher.dispatch(
      InternalEventCodesEnum.ChatUpdated,
      updatedChat,
      eventSource,
    );

    return updatedChat;
  }

}

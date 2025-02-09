import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { UsersService } from '../services';
import { AuthPermissionMessageDto } from '../dto';
import { RabbitChannelsEnum } from '../../message/enums';

export enum AuthRMQMessagesEnum {
  BusinessPermissionAdded = 'business.event.permission.added',
  BusinessPermissionDeleted = 'business.event.permission.deleted',
}

@Controller()
export class AuthUserConsumer {
  constructor(
    private readonly usersUsersService: UsersService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: AuthRMQMessagesEnum.BusinessPermissionAdded,
  })
  public async onBusinessPermissionAdded(payload: AuthPermissionMessageDto): Promise<void> {
    await this.usersUsersService.update({
      _id: payload.userId,

      $addToSet: {
        businesses: payload.businessId,
      },
    }, true);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: AuthRMQMessagesEnum.BusinessPermissionDeleted,
  })
  public async onBusinessPermissionRemoved(payload: AuthPermissionMessageDto): Promise<void> {
    await this.usersUsersService.update({
      _id: payload.userId,

      $pullAll: {
        businesses: [payload.businessId],
      },
    });
  }
}

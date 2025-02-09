import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { UsersService } from '../services';
import { UserRmqDto, BusinessRmqDto } from '../dto';
import { RabbitChannelsEnum } from '../../message/enums';
import { UserDocument } from '../schema';

/**
 * @ref nodejs-backend/users/src/user/enums/users-rabbit-messages.enum.ts
 */
enum UserRabbitMessagesEnum {
  UserCreated = 'users.event.user.created',
  UserUpdated = 'users.event.user.updated',
  UserRemoved = 'users.event.user.removed',

  AccountUpdated = 'users.event.user_account.updated',
  ReportDataPrepared = 'users.event.report-data.prepared',
  UserExported = 'users.event.user.export',

  FixDifference = 'users.event.fix.difference',
}

@Controller()
export class UsersConsumer {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: UserRabbitMessagesEnum.UserCreated,
  })
  public async onUserCreated(
    dto: UserRmqDto,
  ): Promise<void> {
    await this.usersService.create({
      ...dto,
      businesses: dto.businesses.map((business: BusinessRmqDto) => business._id),
    });
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: UserRabbitMessagesEnum.UserUpdated,
  })
  public async onUserUpdated(
    dto: UserRmqDto,
  ): Promise<void> {
    await this.onUserExported(dto);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: UserRabbitMessagesEnum.UserExported,
  })
  public async onUserExported(
    dto: UserRmqDto,
  ): Promise<void> {
    await this.usersService.update({
      _id: dto._id,

      $set: {
        ...dto,
        businesses: dto.businesses.map((business: BusinessRmqDto) => business._id),
      },
    }, true);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: UserRabbitMessagesEnum.UserRemoved,
  })
  public async onUserRemoved(
    dto: UserRmqDto,
  ): Promise<void> {
    await this.usersService.remove(dto._id);
  }

  @MessagePattern({ 
    channel: RabbitChannelsEnum.Message,
    name: UserRabbitMessagesEnum.FixDifference,
  })
  public async fixUserDifference(payload: { users: string[] }): Promise<any> {
    const users: string[] = payload.users;
    const messageUsers: UserDocument[] = await this.usersService.find({ });
    const messageUserIds: string[] = messageUsers.map((user: UserDocument) => user._id);
    const usersToDelete: string[] = messageUserIds.filter((messageUserId: string) => !users.includes(messageUserId));
    await this.usersService.deleteMany({ _id: { $in: usersToDelete } });
  }
}

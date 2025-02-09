import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { CreateBusinessReportResponseDto } from '../dto';
import { UserRabbitMessagesEnum } from '../enums';
import { UserModel } from '../models';
import { userToUserDtoTransformer } from '../transformers/user-to-user-dto.transformer';

@Injectable()
export class UserEventsProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async produceUserRemovedEvent(user: UserModel): Promise<void> {
    await this.send(UserRabbitMessagesEnum.UserRemoved, await userToUserDtoTransformer(user));
  }

  public async produceUserCreatedEvent(user: UserModel): Promise<void> {
    await this.send(UserRabbitMessagesEnum.UserCreated, await userToUserDtoTransformer(user));
  }

  public async produceUserUpdatedEvent(userUpdated: UserModel): Promise<void> {
    await this.send(UserRabbitMessagesEnum.UserUpdated, await userToUserDtoTransformer(userUpdated));
    await this.send(UserRabbitMessagesEnum.UserAccountUpdated, {
      ...userUpdated.toObject().userAccount,
    });
  }

  public async produceUserReportDataPreparedEvent(payload: CreateBusinessReportResponseDto[]): Promise<void> {
    await this.send(UserRabbitMessagesEnum.ReportDataPrepared, payload);
  }

  public async produceUserExportEvent(user: UserModel): Promise<void> {
    await this.send(UserRabbitMessagesEnum.UserExported, await userToUserDtoTransformer(user));
  }

  private async send(event: UserRabbitMessagesEnum, payload: any): Promise<void> {
    await this.rabbitClient.send(
      { channel: event, exchange: 'async_events' },
      { name: event, payload },
      true
    );
  }
}

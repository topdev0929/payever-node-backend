import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient, RabbitMqRPCClient } from '@pe/nest-kit';
import { RabbitMessagesEnum } from '../../common';
import { UserDocumentSchema as UserSchema } from '../schemas';
import { UserModel } from '../models';
import { userToUserDtoTransformer } from '../transformers/user-to-user-dto.transformer';

@Injectable()
export class UserEventProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly rabbitMqRPCClient: RabbitMqRPCClient,
    private readonly logger: Logger,
  ) { }

  public async produceUserRemovedEvent(user: UserSchema): Promise<void> {
    await this.send(RabbitMessagesEnum.UserRemoved, await userToUserDtoTransformer(user));
  }

  public async produceUserRegisteredEvent(payload: any): Promise<void> {
    await this.sendRPCCall(payload, RabbitMessagesEnum.RpcUserRegistered);
  }

  public async produceUserExportedEvent(user: UserModel): Promise<void> {
    await this.send(RabbitMessagesEnum.UserExport, user);
  }

  public async sendRPCCall(payload: any, eventName: string): Promise<void> {
    await this.rabbitMqRPCClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload,
      },
      {
        responseType: 'json',
      },
      true,
    ).catch((error: any) => {
      this.logger.error(
        {
          data: payload,
          error: error.message,
          message: 'Failed users RPC call',
          routingKey: eventName,
        },
        error.stack,
        'UserEventProducer',
      );
    });
  }

  private async send(event: RabbitMessagesEnum, payload: any): Promise<void> {
    await this.rabbitClient.send(
      { channel: event, exchange: 'async_events' },
      { name: event, payload },
      true,
    );
  }
}

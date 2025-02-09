import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { RabbitMessagesEnum } from '../../common';
import { UserTokenModel } from 'src/users/models';

@Injectable()
export class TokenEventProducer {
  constructor(private readonly rabbitClient: RabbitMqClient) { }

  public async produceTokenIssuedEvent(userModel: UserTokenModel): Promise<void> {
    await this.rabbitClient.send(
      {
      channel:  RabbitMessagesEnum.AccessTokenIssued,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.AccessTokenIssued,
        payload: userModel,
      },
      true,
    );
  }
}

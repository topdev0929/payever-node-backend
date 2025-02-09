import { Injectable } from '@nestjs/common';
import { RabbitMqClient, UserTokenInterface } from '@pe/nest-kit';
import { RabbitMessagesEnum } from '../../common';

@Injectable()
export class BusinessEnabledEventProducer {
  constructor(private readonly rabbitClient: RabbitMqClient) { }

  public async produceBusinessEnabledEvent(userToken: UserTokenInterface, businessId: string): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.BusinessEnabledAdded,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.BusinessEnabledAdded,
        payload: {
          businessId,
          userToken,
        },
      },
      true,
    );
  }
}

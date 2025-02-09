import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { BusinessModel, IntegrationModel } from '@pe/third-party-sdk';
import { PaymentActionDto } from '../dto';
import { MessageBusEventsEnum } from '../enum';

@Injectable()
export class EventProducer {
  constructor(
    private readonly rabbitMqClient: RabbitMqClient,
  ) { }

  public async sendOuterPaymentActionRequest(
    business: BusinessModel,
    integration: IntegrationModel,
    action: string,
    dto: PaymentActionDto,
  ): Promise<void> {
    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.IntegrationPaymentActionRequested,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.IntegrationPaymentActionRequested,
        payload: {
          action,
          business: {
            id: business.id,
          },
          integration: {
            name: integration.name,
          },
          ...dto,
        },
      },
    );
  }
}

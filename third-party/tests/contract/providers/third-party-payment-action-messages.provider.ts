import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { BusinessModel } from '../../../src/business/models';
import { MessageBusEventsEnum } from '../../../src/payments/enum';
import { EventProducer } from '../../../src/payments/producer';
import { IntegrationModel } from '@pe/third-party-sdk';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

@Injectable()
export class ThirdPartyPaymentActionMessagesProvider extends AbstractMessageMock {

  @PactRabbitMqMessageProvider(MessageBusEventsEnum.IntegrationPaymentActionRequested)
  public async mockThirdPaymentAction(): Promise<void> {
    const producer: EventProducer = await this.getProvider<EventProducer>(EventProducer);
    await producer.sendOuterPaymentActionRequest(
      { id: BUSINESS_ID } as BusinessModel,
      { name: 'integration_name' } as IntegrationModel,
      'some_action_name',
      {
        fields: {},
        reference: 'transaction reference',
      },
    );
  }
}

import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import * as uuid from 'uuid';
import { RabbitMessagesEnum } from '../../../src/common';
import { InivtationEventsProducer } from '../../../src/employees/producer';

@Injectable()
export class InvitationMessagesMock extends AbstractMessageMock {
  @PactRabbitMqMessageProvider(RabbitMessagesEnum.PayeverBusinessEmail)
  public async mockBusinessEmail(): Promise<void> {
    const producer: InivtationEventsProducer = await this.getProvider<InivtationEventsProducer>(
      InivtationEventsProducer,
    );
    await producer.produceStaffInvitationEmailMessage(uuid.v4(), 'hello@payever.de', 'www.google.com', 'de');
  }
}

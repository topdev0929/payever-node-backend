import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { OAuthRabbitEventsProducer } from '../../../src/oauth/producers';
import * as uuid from 'uuid';
import { RabbitMessagesEnum } from '../../../src/common';

@Injectable()
export class OAuthRabbitEventsMessagesMock extends AbstractMessageMock {
  @PactRabbitMqMessageProvider(RabbitMessagesEnum.OAuthClientRemoved)
  public async mockOauthClientRemoved(): Promise<void> {
    const producer: OAuthRabbitEventsProducer = await this.getProvider<OAuthRabbitEventsProducer>(
      OAuthRabbitEventsProducer,
    );
    await producer.oauthClientRemoved(uuid.v4(), uuid.v4());
  }
}

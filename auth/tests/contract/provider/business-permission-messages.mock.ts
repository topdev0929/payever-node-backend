import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import * as uuid from 'uuid';
import { RabbitMessagesEnum } from '../../../src/common';
import { BusinessPermissionEventProducer } from '../../../src/users/producer';

@Injectable()
export class BusinessPermissionMessagesMock extends AbstractMessageMock {
  @PactRabbitMqMessageProvider(RabbitMessagesEnum.BusinessPermissionAdded)
  public async mockProduceBusinessPermissionAddedEvent(): Promise<void> {
    const producer: BusinessPermissionEventProducer = await this.getProvider<BusinessPermissionEventProducer>(
      BusinessPermissionEventProducer,
    );
    await producer.produceBusinessPermissionAddedEvent(uuid.v4(), uuid.v4());
  }
  @PactRabbitMqMessageProvider(RabbitMessagesEnum.BusinessPermissionDeleted)
  public async mockProduceBusinessPermissionDeletedEvent(): Promise<void> {
    const producer: BusinessPermissionEventProducer = await this.getProvider<BusinessPermissionEventProducer>(
      BusinessPermissionEventProducer,
    );
    await producer.produceBusinessPermissionDeletedEvent(uuid.v4(), uuid.v4());
  }
}

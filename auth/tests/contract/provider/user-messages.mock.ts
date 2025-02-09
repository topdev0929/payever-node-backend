import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { UserEventProducer } from '../../../src/users/producer';
import * as uuid from 'uuid';
import { RabbitMessagesEnum } from '../../../src/common';
import { UserModel } from '../../../src/users/models';

@Injectable()
export class UserMessagesMock extends AbstractMessageMock {
  private userModel: UserModel = {
    _id: uuid.v4(),
    email: 'someemail@test.com',
    firstName: 'some firstName',
    lastName: 'some LastName',
  } as unknown as UserModel;

  @PactRabbitMqMessageProvider(RabbitMessagesEnum.UserExport)
  public async mockProduceUserExportedEvent(): Promise<void> {
    const producer: UserEventProducer = await this.getProvider<UserEventProducer>(
      UserEventProducer,
    );
    await producer.produceUserExportedEvent(this.userModel);
  }
}

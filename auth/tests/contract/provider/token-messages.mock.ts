import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import * as uuid from 'uuid';
import { RabbitMessagesEnum } from '../../../src/common';
import { UserTokenModel } from '../../../src/users/models';
import { RolesEnum } from '@pe/nest-kit';
import { TokenEventProducer } from '../../../src/auth/producer';

@Injectable()
export class TokenIssueMessagesMock extends AbstractMessageMock {
  private userModel: UserTokenModel = {
    id: uuid.v4(),
    roles: [{
      name: RolesEnum.admin,
    }],
  } as unknown as UserTokenModel;

  @PactRabbitMqMessageProvider(RabbitMessagesEnum.AccessTokenIssued)
  public async mockProduceTokenIssuedEvent(): Promise<void> {
    const producer: TokenEventProducer = await this.getProvider<TokenEventProducer>(
      TokenEventProducer,
    );
    await producer.produceTokenIssuedEvent(this.userModel);
  }
}

import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { RolesEnum } from '@pe/nest-kit';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { RabbitBinding } from '../../../src/environments';
import { AuthLoginRmqMessageDto } from '../../../src/subscriptions/dto';
import { ProvidersEnum } from '../config';

const loginEventMessageMatcher = {
  id: Matchers.uuid(),
  roles: Matchers.eachLike({
    name: Matchers.term({
      matcher: Object.keys(RolesEnum).join('|'),
      generate: RolesEnum.admin,
    })
  })
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: loginEventMessageMatcher,
    dtoClass: AuthLoginRmqMessageDto,
    name: RabbitBinding.Login,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Auth);

describe('Receive auth bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

import 'mocha';
import { ExpectedMessageDto, MessageConsumerPactFactory, asyncConsumerChecker } from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { pactConfiguration, ProvidersEnum } from '../config';
import { RemoveBusinessDto } from '../../../src/notifications/dto';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
    },
    dtoClass: RemoveBusinessDto,
    name: 'users.event.business.removed',
  },
];

const messagePactUsers: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.Users,
);

describe('Receive business bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePactUsers, message);
    });
  }
});

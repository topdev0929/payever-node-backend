import 'mocha';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, MessageConsumerPactFactory } from '@pe/pact-kit';
import { pactConfiguration, ProvidersEnum } from '../config';
import { RabbitEventNameEnum } from '../../../src/environments/rabbitmq-names.enum';
import { BusinessDto, RemoveBusinessDto } from '../../../src/business/dto';
import { AuthMessageDto } from '../../../src/plugin';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      id: Matchers.uuid(),
    },
    dtoClass: AuthMessageDto,
    name: 'oauth.event.oauthclient.removed',
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.Auth,
);

describe('Receive business bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message)
    });
  }
});

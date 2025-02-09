import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { PePact, asyncConsumerChecker, ExpectedMessageDto } from '@pe/pact-kit';
import 'mocha';
import { ProvidersEnum } from '../config/providers.enum';

// eslint-disable-next-line sonarjs/no-empty-collection
const messages: ExpectedMessageDto[] = [];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Appointment);

describe('Receive app-registry application bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

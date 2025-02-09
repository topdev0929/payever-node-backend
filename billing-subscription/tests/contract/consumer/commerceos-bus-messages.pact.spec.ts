import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { AppRegistryEventNameEnum } from '../../../src/subscriptions/enums';
import { AppRegistryInstalledRmqMessageDto } from '../../../src/subscriptions/dto';
import { ProvidersEnum } from '../config';

const appRegistryEventMatcher = {
  businessId: Matchers.uuid(),
  code: Matchers.string()
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: appRegistryEventMatcher,
    dtoClass: AppRegistryInstalledRmqMessageDto,
    name: AppRegistryEventNameEnum.ApplicationInstalled,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.ThirdParty);

describe('Receive commerceos connection bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

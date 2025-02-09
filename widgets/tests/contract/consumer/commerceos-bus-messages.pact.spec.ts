import { ExpectedMessageDto, PePact, asyncConsumerChecker } from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { ApplicationInstalledDto, ApplicationUninstalledDto } from '../../../src/widget';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      code: Matchers.like('abc123'),
    },
    dtoClass: ApplicationInstalledDto,
    name: 'apps.rpc.readonly.widgets-install-app',
  },
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      code: Matchers.like('abc123'),
    },
    dtoClass: ApplicationUninstalledDto,
    name: 'apps.rpc.readonly.widgets-uninstall-app',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(
  ProvidersEnum.CommerceOs,
);

describe('Receive CommerceOs bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

import 'reflect-metadata';
import { MessageConsumerPact, Matchers } from '@pact-foundation/pact';
import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import { ProvidersEnum } from '../config';
import { AppInstalledDto } from '../../../src/user/dto/app-installation';


const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      code: Matchers.like('123abc'),
    },
    dtoClass: AppInstalledDto,
    name: 'app-registry.event.application.installed',
  },
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      code: Matchers.like('123abc'),
    },
    dtoClass: AppInstalledDto,
    name: 'app-registry.event.application.uninstalled',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Commerceos);

describe('Receive commerceos micro message', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

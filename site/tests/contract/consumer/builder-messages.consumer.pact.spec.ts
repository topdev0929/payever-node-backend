import 'mocha';
import { Matchers } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';

import { ProvidersEnum } from '../config';
import { ApplicationThemePublishedDto } from '@pe/builder-theme-kit';

const applicationThemePublished = {
  application: {
    id: Matchers.uuid(),
    type: Matchers.like('shop')
  },
  applicationTheme: {
    application: Matchers.uuid(),
    id: Matchers.uuid(),
    theme: Matchers.uuid(),
  },
  compiled: {
    theme: {
      data: Matchers.like({}),
      routing: Matchers.like({}),
      context: Matchers.like({}),
      application: Matchers.like('any'),
      themeSource: Matchers.like('any'),
    },
  },
  id: Matchers.uuid(),
  isDeployed: true,
  theme: {
    id: Matchers.uuid(),
  },
  version: Matchers.like('any'),
  versionNumber: Matchers.like(1),
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: applicationThemePublished,
    dtoClass: ApplicationThemePublishedDto,
    name: 'builder-site.event.theme.published',
  }
];

const messagePact = PePact.getMessageConsumer(ProvidersEnum.Builder);

describe('Receive builder bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

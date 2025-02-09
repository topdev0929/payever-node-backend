import 'mocha';
import { eachLike } from '@pact-foundation/pact/src/dsl/matchers';
import { MessageConsumerPact, Matchers } from '@pact-foundation/pact';

import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import { BusinessIdentifiersDto } from '../../../src/terminal';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      businessIds: eachLike(Matchers.uuid()),
    },
    dtoClass: BusinessIdentifiersDto,
    name: 'mailer-report.event.report-data.requested',
  },
];

const messagePactMailerReport: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.MailerReport);

describe('Receive mailer report message bus', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePactMailerReport, message);
    });
  }
});

import 'mocha';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import { ReportDataRequestedDto } from '../../../src/integration/dto';

import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      businessIds: Matchers.eachLike(Matchers.uuid()),
    },
    dtoClass: ReportDataRequestedDto,
    name: 'mailer-report.event.report-data.requested',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.MailerReport);

describe('Receive Integration bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

import 'mocha';
import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { ProvidersEnum } from '../config';
import { CreateBusinessReportRequestDto } from '../../../src/user/dto';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      businessIds: Matchers.eachLike(Matchers.uuid()),
    },
    dtoClass: CreateBusinessReportRequestDto,
    name: 'mailer-report.event.report-data.requested',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.MailerReport);

describe('Receive auth bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

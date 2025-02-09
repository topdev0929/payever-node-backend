import 'mocha';
import { eachLike } from '@pact-foundation/pact/src/dsl/matchers';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';

import { ExpectedMessageDto, PePact, asyncConsumerChecker } from '@pe/pact-kit';
import { ProvidersEnum } from '../config';
import { RequestDataDto } from '../../../src/bus-messages/dto';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      businessIds: eachLike(Matchers.uuid()),
    },
    dtoClass: RequestDataDto,
    name: 'mailer-report.event.report-data.requested',
  },
];

const messagePactUsers: MessageConsumerPact = PePact.getMessageConsumer(
  ProvidersEnum.MailerReport,
);

describe('Receive request data bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePactUsers, message);
    });
  }
});

import 'mocha';
import { eachLike } from '@pact-foundation/pact/src/dsl/matchers';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';

import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import { RabbitBinding } from '../../../src/environments';
import { ProvidersEnum } from '../config/providers.enum';
import { MailerReportEventDto } from '../../../src/mail-report/dto/mailer-report-event.dto';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      businessIds: eachLike(Matchers.uuid()),
    },
    dtoClass: MailerReportEventDto,
    name: RabbitBinding.MailReportDataRequested,
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.MailerReport);

describe('Receive mailer report bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message)
    });
  }
});

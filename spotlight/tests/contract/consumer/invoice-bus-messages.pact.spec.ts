import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { InvoiceEventDto } from '../../../src/spotlight/apps/invoice-app/dto';
import { InvoiceRabbitEventsEnum, InvoiceStatusEnum } from '../../../src/spotlight/apps/invoice-app/enums';
import { ProvidersEnum } from '../config';

const invoiceEventMatcher = {
  _id: Matchers.uuid(),
  invoiceId: Matchers.uuid(),
  name: Matchers.string(),
  businessId: Matchers.uuid(),
  customer: {
    name: Matchers.uuid()
  },
  status: Matchers.term({
    matcher: `${InvoiceStatusEnum.Draft}|${InvoiceStatusEnum.Finalized}|
            ${InvoiceStatusEnum.Uncollectible}|${InvoiceStatusEnum.Paid}|${InvoiceStatusEnum.Voided}`,
    generate: InvoiceStatusEnum.Finalized,
  })
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: invoiceEventMatcher,
    dtoClass: InvoiceEventDto,
    name: InvoiceRabbitEventsEnum.InvoiceCreated,
  },
  {
    contentMatcher: invoiceEventMatcher,
    dtoClass: InvoiceEventDto,
    name: InvoiceRabbitEventsEnum.InvoiceUpdated,
  },
  {
    contentMatcher: invoiceEventMatcher,
    dtoClass: InvoiceEventDto,
    name: InvoiceRabbitEventsEnum.InvoiceExported,
  },
  {
    contentMatcher: invoiceEventMatcher,
    dtoClass: InvoiceEventDto,
    name: InvoiceRabbitEventsEnum.InvoiceRemoved,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Invoice);

describe('Receive invoice bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

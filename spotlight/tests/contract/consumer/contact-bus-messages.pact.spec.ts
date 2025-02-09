import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { ContactEventDto } from '../../../src/spotlight/apps/contact-app/dto';
import { ContactRabbitEventsEnum } from '../../../src/spotlight/apps/contact-app/enums';
import { ProvidersEnum } from '../config';

const contactEventMatcher = {
  contact: {
    _id: Matchers.uuid(),
    businessId: Matchers.uuid(),
    fields: Matchers.eachLike({
      field: {
        name: Matchers.string()
      },
      value: Matchers.string()
    }),
  }
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: contactEventMatcher,
    dtoClass: ContactEventDto,
    name: ContactRabbitEventsEnum.ContactCreated,
  },
  {
    contentMatcher: contactEventMatcher,
    dtoClass: ContactEventDto,
    name: ContactRabbitEventsEnum.ContactUpdated,
  },
  {
    contentMatcher: contactEventMatcher,
    dtoClass: ContactEventDto,
    name: ContactRabbitEventsEnum.ContactExported,
  },
  {
    contentMatcher: contactEventMatcher,
    dtoClass: ContactEventDto,
    name: ContactRabbitEventsEnum.ContactRemoved,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Contact);

describe('Receive contact bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

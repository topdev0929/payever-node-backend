import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { BusinessMailDto } from '../../../src/mailer/dto';
import { ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      businessId: Matchers.uuid(),
      templateName: 'products-import-failed',
      variables: {
        errorsList: {
          messages: Matchers.eachLike('some message'),
          sku: Matchers.like('some error sku'),
        },
      },
    },
    dtoClass: BusinessMailDto,
    name: 'payever.event.business.email',
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      businessId: Matchers.uuid(),
      templateName: 'products-import-successful',
    },
    dtoClass: BusinessMailDto,
    name: 'payever.event.business.email',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(
  ProvidersEnum.Synchronizer,
);

describe('Receive synchronizer bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

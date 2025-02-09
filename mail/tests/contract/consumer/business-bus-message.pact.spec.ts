import 'mocha';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { ExpectedMessageDto, MessageConsumerPactFactory, asyncConsumerChecker } from '@pe/pact-kit';
import { RabbitBinding } from '../../../src/environments';
import { pactConfiguration } from '../config/configuration';
import { ProvidersEnum } from '../config/providers.enum';
import { BusinessDto, RemoveBusinessDto } from '../../../src/modules';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      companyAddress: {
        country: Matchers.like('Deutscheland'),
      },
      name: Matchers.like('Business name'),
    },
    dtoClass: BusinessDto,
    name: RabbitBinding.BusinessCreated,
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      name: Matchers.like('Updated business name'),
    },
    dtoClass: BusinessDto,
    name: RabbitBinding.BusinessUpdated,
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
    },
    dtoClass: RemoveBusinessDto,
    name: RabbitBinding.BusinessRemoved,
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.Users,
)

describe('Receive business application bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message)
    });
  }
});

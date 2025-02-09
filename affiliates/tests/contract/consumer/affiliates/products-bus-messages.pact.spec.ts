import 'mocha';
import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { ProvidersEnum } from '../../config/providers.enum';
import { RabbitBinding } from '../../../../src/affiliates/enums/rabbit-binding.enum';
import { ProductRmqMessageDto } from '../../../../src/affiliates/dto';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      businessUuid: Matchers.uuid(),
      price: Matchers.integer(),
      title: Matchers.like('some title'),
    },
    dtoClass: ProductRmqMessageDto,
    name: RabbitBinding.ProductUpdated,
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
      businessUuid: Matchers.uuid(),
      price: Matchers.integer(),
      title: Matchers.like('some title'),
    },
    dtoClass: ProductRmqMessageDto,
    name: RabbitBinding.ProductRemoved,
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Products);

describe('Receive affiliates bus messages from products', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

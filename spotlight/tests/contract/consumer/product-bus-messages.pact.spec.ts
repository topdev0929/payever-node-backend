import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { ProductEventDto } from '../../../src/spotlight/apps/products-app/dto';
import { ProductRabbitMessagesEnum } from '../../../src/spotlight/apps/products-app/enums';
import { ProvidersEnum } from '../config';

const productEventMatcher = {
  uuid: Matchers.uuid(),
  businessUuid: Matchers.uuid(),
  title: Matchers.string(),
  imagesUrl: Matchers.eachLike(Matchers.string()),
  images: Matchers.eachLike(Matchers.string()),
  createdAt: Matchers.string(),
  price: Matchers.integer(),
  salePrice: Matchers.integer(),
  description: Matchers.string()
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: productEventMatcher,
    dtoClass: ProductEventDto,
    name: ProductRabbitMessagesEnum.ProductCreated,
  },
  {
    contentMatcher: productEventMatcher,
    dtoClass: ProductEventDto,
    name: ProductRabbitMessagesEnum.ProductUpdated,
  },
  {
    contentMatcher: productEventMatcher,
    dtoClass: ProductEventDto,
    name: ProductRabbitMessagesEnum.ProductExported,
  },
  {
    contentMatcher: productEventMatcher,
    dtoClass: ProductEventDto,
    name: ProductRabbitMessagesEnum.ProductDeleted,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Product);

describe('Receive products bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

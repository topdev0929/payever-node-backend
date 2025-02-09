import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { RabbitBinding } from '../../../src/environments';
import { ProductRemovedDto, ProductRmqMessageDto } from '../../../src/subscriptions/dto';
import { ProvidersEnum } from '../config';
import { ProductExportedContractDto } from './contract-dto';

const productExportedMessageMatcher = {
  _id: Matchers.uuid(),
  businessId: Matchers.uuid()
};

const productMessageMatcher = {
  _id: Matchers.uuid(),
  businessId: Matchers.uuid(),
  title: Matchers.string(),
  createdAt: Matchers.string(),
  price: Matchers.integer(),
  images: Matchers.eachLike(Matchers.string()),
  imagesUrl: Matchers.eachLike(Matchers.string()),
  categories: Matchers.eachLike({
    _id: Matchers.uuid(),
    businessId: Matchers.uuid(),
    slug: Matchers.string(),
    title: Matchers.string()
  })
}

const productRemovedMatcher = {
  _id: Matchers.uuid(),
}

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: productExportedMessageMatcher,
    dtoClass: ProductExportedContractDto,
    name: RabbitBinding.ProductExported,
  },
  {
    contentMatcher: productMessageMatcher,
    dtoClass: ProductRmqMessageDto,
    name: RabbitBinding.ProductUpdated,
  },
  {
    contentMatcher: productRemovedMatcher,
    dtoClass: ProductRemovedDto,
    name: RabbitBinding.ProductRemoved,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Products);

describe('Receive products bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

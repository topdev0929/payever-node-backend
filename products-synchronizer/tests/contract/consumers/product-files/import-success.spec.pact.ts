import 'reflect-metadata';
import { MessageConsumerPact, Matchers } from '@pact-foundation/pact';
import { asyncConsumerChecker, MessageConsumerPactFactory } from '@pe/pact-kit';
import { ImportedItemTypesEnum, ProductFilesRabbitMessagesEnum } from '../../../../src/synchronizer/enums';
import { ImportSuccessDto } from '../../../../src/synchronizer/dto/product-files-rabbit-messages';
import { pactConfiguration, ProvidersEnum } from '../../config';

const messages: any[] = [
  {
    contentMatcher: {
      errors: Matchers.eachLike({
        messages: ['Some error message'],
        sku: Matchers.like('test_sku'),
      }),
      items: Matchers.eachLike({
        sku: Matchers.like('test_sku'),
        type: Matchers.term({
          generate: ImportedItemTypesEnum.Product,
          matcher: `${ImportedItemTypesEnum.Product}|${ImportedItemTypesEnum.Inventory}`,
        }),
      }, { min: 1 }),
      synchronization: {
        taskId: Matchers.uuid(),
      },
    },
    dtoClass: ImportSuccessDto,
    name: ProductFilesRabbitMessagesEnum.ImportSuccess,
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.ProductFiles,
);

describe('Receive product-files.event.import.success message', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

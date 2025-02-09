import 'reflect-metadata';
import { MessageConsumerPact, Matchers } from '@pact-foundation/pact';
import { asyncConsumerChecker, MessageConsumerPactFactory } from '@pe/pact-kit';
import { ProductFilesRabbitMessagesEnum } from '../../../../src/synchronizer/enums';
import { ImportFailedDto } from '../../../../src/synchronizer/dto/product-files-rabbit-messages';
import { pactConfiguration, ProvidersEnum } from '../../config';

const messages: any[] = [
  {
    contentMatcher: {
      data: {
        errorMessage: Matchers.like('Some error message'),
      },
      synchronization: {
        taskId: Matchers.uuid(),
      },
    },
    dtoClass: ImportFailedDto,
    name: ProductFilesRabbitMessagesEnum.ImportFailed,
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.ProductFiles,
);

describe('Receive product-files.event.import.failed message', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

import 'mocha';
import { eachLike } from '@pact-foundation/pact/src/dsl/matchers';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';

import { ExpectedMessageDto, MessageConsumerPactFactory, asyncConsumerChecker } from '@pe/pact-kit';
import { RemoveProductDto } from '../../../src/modules';
import { RabbitBinding } from '../../../src/environments';
import { pactConfiguration } from '../config/configuration';
import { ProvidersEnum } from '../config/providers.enum';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      productIds: eachLike(
        Matchers.uuid(),
      ),
    },
    dtoClass: RemoveProductDto,
    name: RabbitBinding.ProductRemoved,
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.Products,
);

describe('Receive product application bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message)
    });
  }
});

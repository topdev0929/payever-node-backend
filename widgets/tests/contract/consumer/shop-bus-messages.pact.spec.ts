import { ExpectedMessageDto, PePact, asyncConsumerChecker } from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { ChannelSetActiveDto } from '../../../src/statistics';
import { pactConfiguration, ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      channelSetId: Matchers.uuid(),
    },
    dtoClass: ChannelSetActiveDto,
    name: 'shop.event.shop-active.updated',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(
  ProvidersEnum.Shops,
);

describe('Receive shop bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

import 'mocha';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, MessageConsumerPactFactory } from '@pe/pact-kit';
import { pactConfiguration } from '../../config/configuration';
import { ProvidersEnum } from '../../config/providers.enum';
import { ChannelSetCreatedDto, ChannelNamedDto } from '../../../../src/statistics';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      channel: {
        type: Matchers.like('some type'),
      },
      id: Matchers.uuid(),
    },
    dtoClass: ChannelSetCreatedDto,
    name: 'channels.event.channel-set.created',
  },
  {
    contentMatcher: {
      id: Matchers.uuid(),
      name: Matchers.like('Payever'),
    },
    dtoClass: ChannelNamedDto,
    name: 'channels.event.channel-set.named',
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.Marketing,
);

describe('Receive channelset bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}"messages from marketing`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

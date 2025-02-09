import 'mocha';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { ExpectedMessageDto, asyncConsumerChecker, MessageConsumerPactFactory } from '@pe/pact-kit';
import { ChannelSetCreatedEventDto } from '../../../src/channel-set';
import { RabbitEventNameEnum } from '../../../src/environments/rabbitmq';
import { pactConfiguration, ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      id: Matchers.uuid(),
      channel: {
        type: Matchers.like('channel1'),
      },
      business: {
        id: Matchers.uuid(),
      },
    },
    dtoClass: ChannelSetCreatedEventDto,
    name: RabbitEventNameEnum.CheckoutEventChannelSetByBusinessExport,
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.Checkout,
);

describe('Receive checkout bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}"messages`, () => {
      return asyncConsumerChecker(messagePact, message)
    })
  }
});

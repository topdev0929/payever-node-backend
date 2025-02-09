import 'mocha'
import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { ProvidersEnum } from '../../config/providers.enum';
import { PostStatusEnum, RmqEventsEnum } from '../../../../src/social/enums';
import { ChannelSetCreatedEventDto, ChannelSetRemovedEventDto } from '../../../../src/channel-set';
import { RabbitEventNameEnum } from '../../../../src/common';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      id: Matchers.uuid(),
      channel: {
        type: Matchers.like('type'),
      },
      business: {
        id: Matchers.uuid(),
      }
    },
    dtoClass: ChannelSetCreatedEventDto,
    name: RabbitEventNameEnum.ChannelSetCreated,
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
    },
    dtoClass: ChannelSetRemovedEventDto,
    name: RabbitEventNameEnum.ChannelSetDeleted,
  },
  {
    contentMatcher: {
      id: Matchers.uuid(),
      channel: {
        type: Matchers.like('type'),
      },
      business: {
        id: Matchers.uuid(),
      }
    },
    dtoClass: ChannelSetCreatedEventDto,
    name: RabbitEventNameEnum.CheckoutEventChannelSetByBusinessExport,
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.ThirdParty);

describe('Receive social bus messages from Channels', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});


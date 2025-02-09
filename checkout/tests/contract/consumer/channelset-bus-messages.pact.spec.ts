import 'mocha';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { PePact, asyncConsumerChecker, ExpectedMessageDto } from '@pe/pact-kit';
import { ChannelSetCreatedDto, ChannelSetNamedDto, DeletedChannelDto, CheckoutChannelSetCreatedDto } from '../../../src/channel-set';
import { RabbitBinding } from '../../../src/environments';
import { ProvidersEnum } from '../config/providers.enum';
import { ChannelSetActivatedDto } from '../../../src/channel-set/dto/channel-set-activated.dto';

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
    name: RabbitBinding.ChannelSetCreated,
  },
  {
    contentMatcher: {
      id: Matchers.uuid(),
      name: Matchers.like('Payever'),
    },
    dtoClass: ChannelSetNamedDto,
    name: RabbitBinding.ChannelSetNamed,
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
    },
    dtoClass: DeletedChannelDto,
    name: RabbitBinding.ChannelSetDeleted,
  },
  {
    contentMatcher: {
      checkout: Matchers.uuid(),
      id: Matchers.uuid(),
    },
    dtoClass: CheckoutChannelSetCreatedDto,
    name: RabbitBinding.ChannelSetForCheckoutCreated,
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      id: Matchers.uuid(),
    },
    dtoClass: ChannelSetActivatedDto,
    name: RabbitBinding.ChannelSetActivated,
  },
];
const messagePactPos: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Pos);


const messagePactMarketing: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Marketing);

const messagePactPlugins: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Plugins);

const messagePactShops: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Shops);

describe('Receive business bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}"messages from pos`, () => {
      return asyncConsumerChecker(messagePactPos, message)
    });
    it(`Accepts valid "${message.name}"messages from marketing`, () => {
      return asyncConsumerChecker(messagePactMarketing, message)
    });

    it(`Accepts valid "${message.name}"messages from plugins`, () => {
      return asyncConsumerChecker(messagePactPlugins, message)
    });

    it(`Accepts valid "${message.name}"messages from shops`, () => {
      return asyncConsumerChecker(messagePactShops, message)
    });
  }
});

import { Matchers } from '@pact-foundation/pact';
import { ExpectedMessageDto } from '@pe/pact-kit';
import { ChannelSetCreatedEventDto, ChannelSetRemovedEventDto } from '../../../../src/channel-set';
import { RabbitEventNameEnum } from '../../../../src/environments/rabbitmq';

export const ChannelSetExpectedMessages: ExpectedMessageDto[] = [
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
    name: RabbitEventNameEnum.ChannelSetCreated,
  },
  {
    contentMatcher: {
      _id: Matchers.uuid(),
    },
    dtoClass: ChannelSetRemovedEventDto,
    name: RabbitEventNameEnum.ChannelSetDeleted,
  },
];

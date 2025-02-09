import { CommonChannel } from '../submodules/messaging/common-channels';
import { IntegrationChannelHttpResponseDto } from '../dto/outgoing/integration-channel.dto';
import { messageToResponseDto } from './message-to-response-dto.transformer';
import { AbstractChatMessage, Pinned } from '../submodules/platform';
import { MessagingTransformerOptionsInterface } from '../interfaces';
import { pinnedToResponseDtoTransformer } from './pinned-to-response-dto.transformer';

export function integrationChannelToResponseDto(
  channel: CommonChannel,
  options?: MessagingTransformerOptionsInterface,
): IntegrationChannelHttpResponseDto {
  return {
    _id: channel._id,
    business: channel.business,
    createdAt: channel.createdAt,
    description: channel.description,
    messages: channel.lastMessages.map((msg: AbstractChatMessage) => messageToResponseDto(msg, options)),
    photo: channel.photo,
    pinned: channel.pinned?.map((pinned: Pinned) => pinnedToResponseDtoTransformer(pinned, options)),
    title: channel.title,
    type: channel.type,
    usedInWidget: channel.usedInWidget,
  };
}

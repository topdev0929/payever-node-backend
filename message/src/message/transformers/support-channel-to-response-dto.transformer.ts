import { SupportChannel } from '../../message/submodules/messaging/support-channels';
import { SupportChannelHttpResponseDto } from '../dto';
import { messageToResponseDto } from './message-to-response-dto.transformer';
import { MessagingTransformerOptionsInterface } from '../interfaces';
import { AbstractChatMessage, Pinned } from '../submodules/platform';
import { pinnedToResponseDtoTransformer } from './pinned-to-response-dto.transformer';

export function supportChannelToResponseDto(
  channel: SupportChannel,
  options?: MessagingTransformerOptionsInterface,
): SupportChannelHttpResponseDto {
  return {
    _id: channel._id,
    business: null,
    createdAt: channel.createdAt,
    description: channel.description,
    messages: channel.lastMessages.map((msg: AbstractChatMessage) => messageToResponseDto(msg, options)),
    photo: channel.photo,
    pinned: channel.pinned?.map((pinned: Pinned) => pinnedToResponseDtoTransformer(pinned, options)).filter(Boolean),
    signed: channel.signed,
    title: channel.title,
    type: channel.type,
  };
}

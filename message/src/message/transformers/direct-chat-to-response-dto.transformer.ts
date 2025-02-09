import { DirectChat } from '../../message/submodules/messaging/direct-chat';
import { DirectChatHttpResponseDto } from '../dto';
import { memberToResponseDto } from './member-to-response-dto.transformer';
import { messageToResponseDto } from './message-to-response-dto.transformer';
import { MessagingTransformerOptionsInterface } from '../interfaces';
import { AbstractChatMessage, Pinned } from '../submodules/platform';
import { pinnedToResponseDtoTransformer } from './pinned-to-response-dto.transformer';

export function directChatToResponseDto(
  chat: DirectChat,
  options?: MessagingTransformerOptionsInterface,
): DirectChatHttpResponseDto {
  return {
    _id: chat._id,
    business: null,
    createdAt: chat.createdAt,
    expiresAt: chat.expiresAt,
    members: chat.members.map(memberToResponseDto),
    messages: chat.lastMessages.map((msg: AbstractChatMessage) => messageToResponseDto(msg, options)),
    pinned: chat.pinned?.map((pinned: Pinned) => pinnedToResponseDtoTransformer(pinned, options)).filter(Boolean),
    title: chat.title,
    type: chat.type,
  };
}

import { AppChannel } from '../submodules/messaging/app-channels';
import { AppChannelHttpResponseDto } from '../dto';
import { messageToResponseDto } from './message-to-response-dto.transformer';
import { memberToResponseDto } from './member-to-response-dto.transformer';
import { MessagingTransformerOptionsInterface } from '../interfaces';
import { AbstractChatMessage, Pinned } from '../submodules/platform';
import { pinnedToResponseDtoTransformer } from './pinned-to-response-dto.transformer';


export function appChannelToResponseDto(
  chat: AppChannel,
  options?: MessagingTransformerOptionsInterface,
): AppChannelHttpResponseDto {
  return {
    _id: chat._id,
    app: chat.app,
    business: chat.business,
    createdAt: chat.createdAt,
    description: chat.description,
    expiresAt: chat.expiresAt,
    members: chat.members.map(memberToResponseDto),
    messages: chat.lastMessages.map((msg: AbstractChatMessage) => messageToResponseDto(msg, options)),
    photo: chat.photo,
    pinned: chat.pinned?.map((pinned: Pinned) => pinnedToResponseDtoTransformer(pinned, options)).filter(Boolean),
    removedMembers: chat.removedMembers.map(memberToResponseDto),
    signed: chat.signed,
    title: chat.title,
    type: chat.type,
  };
}

import { messageToResponseDto } from './message-to-response-dto.transformer';
import { CommonChannel } from '../../message/submodules/messaging/common-channels';

import { CommonChannelHttpResponseDto } from '../dto';
import { memberToResponseDto } from './member-to-response-dto.transformer';
import { ChannelTypeEnum } from '../enums';
import { MessagingTransformerOptionsInterface } from '../interfaces';
import { AbstractChatMessage, Pinned } from '../submodules/platform';
import { pinnedToResponseDtoTransformer } from './pinned-to-response-dto.transformer';

export function commonChannelToResponseDto(
  channel: CommonChannel,
  options?: MessagingTransformerOptionsInterface,
): CommonChannelHttpResponseDto {

  return {
    _id: channel._id,
    business: channel.business,
    contacts: channel.contacts,
    createdAt: channel.createdAt,
    description: channel.description,
    integrationName: channel.integrationName,
    members: channel.members.map(memberToResponseDto),
    messages: channel.lastMessages.map((msg: AbstractChatMessage) => messageToResponseDto(msg, options)),
    permissions: {
      addMembers: channel.permissions?.addMembers,
      change: channel.permissions?.change,
      live: channel.permissions?.live,
      pinMessages: channel.permissions?.pinMessages,
      publicView: channel.subType === ChannelTypeEnum.Public,
      sendMedia: channel.permissions?.sendMedia,
      sendMessages: channel.permissions?.sendMessages,
      showSender: channel.permissions?.showSender,
    },
    photo: channel.photo,
    pinned: channel.pinned?.map((pinned: Pinned) => pinnedToResponseDtoTransformer(pinned, options)).filter(Boolean),
    signed: channel.signed,
    slug: channel.slug,
    subType: channel.subType,
    title: channel.title,
    type: channel.type,
    usedInWidget: channel.usedInWidget,
  };
}

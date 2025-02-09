import { AppChannel } from '../submodules/messaging/app-channels';
import { CommonChannel } from '../submodules/messaging/common-channels';
import { CustomerChat } from '../submodules/messaging/customer-chat';
import { GroupChat } from '../submodules/messaging/group-chats';
import { DirectChat } from '../submodules/messaging/direct-chat';
import { SupportChannel } from '../submodules/messaging/support-channels';
import { MessagingHttpResponseDto } from '../dto/outgoing/messaging.dto';
import { appChannelToResponseDto } from './app-channel-to-response-dto.transformer';
import { groupChatToResponseDto } from './group-chat-to-response-dto.transformer';
import { commonChannelToResponseDto } from './common-channel-to-response-dto.transformer';
import { customerChatToResponseDto } from './customer-chat-to-response-dto.transformer';
import { AbstractMessaging } from '../../message/submodules/platform';
import { directChatToResponseDto } from './direct-chat-to-response-dto.transformer';
import { supportChannelToResponseDto } from './support-channel-to-response-dto.transformer';
import { MessagingTransformerOptionsInterface } from '../interfaces';

export function messagingToResponseDto(
  chat: AbstractMessaging,
  options?: MessagingTransformerOptionsInterface,
): MessagingHttpResponseDto {
  if (AppChannel.isTypeOf(chat)) {
    return appChannelToResponseDto(chat, options);
  } else if (CommonChannel.isTypeOf(chat)) {
    return commonChannelToResponseDto(chat, options);
  } else if (CustomerChat.isTypeOf(chat)) {
    return customerChatToResponseDto(chat, options);
  } else if (GroupChat.isTypeOf(chat)) {
    return groupChatToResponseDto(chat, options);
  } else if (DirectChat.isTypeOf(chat)) {
    return directChatToResponseDto(chat, options);
  } else if (SupportChannel.isTypeOf(chat)) {
    return supportChannelToResponseDto(chat, options);
  }
}

export function transformWithOptions<T, R>(
  transformFn: (arg: T, options: MessagingTransformerOptionsInterface) => R,
): (options?: MessagingTransformerOptionsInterface) => (item: T) => R {
  return (
    options?: MessagingTransformerOptionsInterface,
  ) => (item: T) => transformFn(item, options);
}

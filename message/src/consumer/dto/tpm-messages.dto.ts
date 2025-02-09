import {
  CustomerChatInterface,
} from '@pe/message-kit';
import {
  MessageAppMessagingDto,
  MessageAppContactDto,
  MessageAppMessageDto,
  MessageAppTextMessageDto,
} from '@pe/message-kit/modules/message/types';

export type TPMContactRMQIncomingDto = MessageAppContactDto;
export type TPMCustomerChatRMQIncomingDto = MessageAppMessagingDto<CustomerChatInterface>;
export type TPMMessageRMQIncomingDto = MessageAppMessageDto;
export type TPMTextMessageRMQIncomingDto = MessageAppTextMessageDto;

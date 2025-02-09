import {
  ChatMessageAttachmentInterface,
  ChatMessageInteractiveInterface,
  ChatMessageComponentInterface,
  ChatMessageType,
} from '@pe/message-kit';

export interface ChatMessageTemplateInterface {
  action?: string;
  attachments?: ChatMessageAttachmentInterface[];
  chatTemplate: string;
  content?: string;
  components?: ChatMessageComponentInterface[];
  interactive?: ChatMessageInteractiveInterface;
  sender?: string;
  type: ChatMessageType;
}

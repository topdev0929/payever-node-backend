import { ChatTextMessage } from '@pe/message-kit';
import { 
  ChatMessageAttachementEmbeddedDocument,
} from '@pe/message-kit/modules/connect-app-sdk/schemas/message/chat-message-attachment';

export interface ChatTextMessageDocument extends ChatTextMessage {
  _id: string;
  attachments: ChatMessageAttachementEmbeddedDocument[];
  emailId?: string;
}

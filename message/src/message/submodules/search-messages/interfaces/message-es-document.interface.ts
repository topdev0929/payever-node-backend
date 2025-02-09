import { ChatMessageStatusEnum } from '@pe/message-kit';

export interface MessageEsDocument {
  _id: string;
  chat: string;
  content: string;
  status: ChatMessageStatusEnum;
}

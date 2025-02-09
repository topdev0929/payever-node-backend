import { ChatMemberStatusEnum } from '@pe/message-kit';
import { MessageUserSessionInterface } from './message-user-session.interfaces';

export interface MessageUserInterface {
  lastSeen?: Date;
  status: ChatMemberStatusEnum;
  sessions: MessageUserSessionInterface[];
}

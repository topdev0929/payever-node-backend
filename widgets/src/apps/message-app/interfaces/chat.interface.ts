import { MessagingTypeEnum } from '../enums';
import { MemberInterface } from './member.interface';
export interface ChatInterface {
  businessId: string;
  photo?: string;
  name: string;
  lastSeen?: Date;
  userId: string;
  members: MemberInterface[];
  type: MessagingTypeEnum;
}

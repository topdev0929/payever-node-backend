import { ChatMemberRoleEnum } from '../enums';

export interface MemberInterface {
  user: string;
  role: ChatMemberRoleEnum;
}

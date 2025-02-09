// tslint:disable: max-union-size
import { ChatMemberRoleEnum } from '@pe/message-kit';
import { ChatMember } from '../../../message/submodules/platform';


export class ChatMemberHttpResponseDto implements Pick<
  ChatMember,
  'user' | 'role'
> {
  public user: string;
  public role: ChatMemberRoleEnum;
}

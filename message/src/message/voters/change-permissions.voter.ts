import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';
import { ChatMemberRoleEnum } from '@pe/message-kit';
import { AbstractMessagingDocument, AbstractMessaging } from '../submodules/platform';
import { VoteCodes } from '../const';

@Voter()
export class ChangePermissionsVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: AbstractMessagingDocument): Promise<boolean> {
    return attribute === VoteCodes.CHANGE_PERMISSIONS;
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: AbstractMessagingDocument,
    user: UserTokenInterface,
  ): Promise<boolean> {
    return AbstractMessaging.getMemberOfUser(chat, user.id)?.role === ChatMemberRoleEnum.Admin;
  }
}

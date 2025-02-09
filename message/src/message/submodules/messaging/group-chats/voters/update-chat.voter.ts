import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';
import { VoteCodes } from '../../../../const';
import { GroupChatDocument, GroupChat } from '../schemas';

@Voter()
export class UpdateChatVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: GroupChatDocument): Promise<boolean> {
    return attribute === VoteCodes.UPDATE_MESSAGING && GroupChat.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: GroupChatDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    if (GroupChat.hasMemberAdminRole(chat, userToken.id)) {
      return true;
    }

    return !(chat.permissions && !chat.permissions.change);
  }
}

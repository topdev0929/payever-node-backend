import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';
import { VoteCodes } from '../../../../const';
import { GroupChatDocument, GroupChat } from '../schemas';
import { ChatMember } from '../../../../submodules/platform';

@Voter()
export class CreateMessageVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: GroupChatDocument): Promise<boolean> {
    return attribute === VoteCodes.CREATE_MESSAGE && GroupChat.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: GroupChatDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    if (ChatMember.hasPermission(GroupChat.getMemberOfUser(chat, userToken.id), 'sendMessages')) {
      return true;
    }

    return !(chat.permissions && !chat.permissions.sendMessages);
  }
}

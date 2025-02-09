import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';
import { VoteCodes } from '../../../../const';
import { GroupChatDocument, GroupChat } from '../schemas';
import { ChatMember } from '../../../../submodules/platform';

@Voter()
export class SendMediaVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: GroupChatDocument): Promise<boolean> {
    return attribute === VoteCodes.SEND_MEDIA && GroupChat.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: GroupChatDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    if (ChatMember.hasPermission(GroupChat.getMemberOfUser(chat, userToken.id), 'sendMedia')) {
      return true;
    }

    return !(chat.permissions && !chat.permissions.sendMedia);
  }
}

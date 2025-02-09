import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';
import { VoteCodes } from '../../../../const';
import { GroupChatDocument, GroupChat } from '../schemas';

@Voter()
export class ReadChatVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: GroupChatDocument): Promise<boolean> {
    return attribute === VoteCodes.READ_MESSAGING && GroupChat.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: GroupChatDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    return Boolean(GroupChat.getMemberOfUser(chat, userToken.id));
  }
}

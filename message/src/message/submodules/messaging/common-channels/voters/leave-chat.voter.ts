import { AbstractVoter, Voter, UserTokenInterface } from '@pe/nest-kit';
import { VoteCodes } from '../../../../const';
import { CommonChannelDocument, CommonChannel } from '../schemas';
import { ChatMember } from '../../../platform';

@Voter()
export class LeaveChatVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: CommonChannelDocument): Promise<boolean> {
    return attribute === VoteCodes.LEAVE_MESSAGING && CommonChannel.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: CommonChannelDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    return chat.members.some(
      (item: ChatMember) => item.user === userToken.id,
    );
  }
}

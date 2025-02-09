import { AbstractVoter, Voter, UserTokenInterface } from '@pe/nest-kit';
import { VoteCodes } from '../../../../const';
import { ChatMember } from '../../../platform';
import { CommonChannelDocument } from '../../common-channels';
import { GroupChat } from '../schemas';

@Voter()
export class LeaveChatVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: CommonChannelDocument): Promise<boolean> {
    return attribute === VoteCodes.LEAVE_MESSAGING && GroupChat.isTypeOf(subject);
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

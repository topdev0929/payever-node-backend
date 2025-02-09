import { AbstractVoter, Voter, UserTokenInterface } from '@pe/nest-kit';

import { DirectChatDocument, DirectChat } from '../schemas';
import { VoteCodes } from '../../../../const';
import { WsVoteCodes } from '../../../../../ws/enums';

@Voter()
export class DirectChatVoter extends AbstractVoter {
  protected async supports(attribute: VoteCodes, subject: DirectChatDocument): Promise<boolean> {
    return [
      VoteCodes.READ_MESSAGING,
      VoteCodes.UPDATE_MESSAGING,
      VoteCodes.DELETE_MESSAGING,

      VoteCodes.READ_MESSAGING_MEMBERS,

      VoteCodes.CREATE_MESSAGE,
      VoteCodes.SEND_MEDIA,

      WsVoteCodes.JOIN_TO_ROOM,
    ].includes(attribute) && DirectChat.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: DirectChatDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    return Boolean(DirectChat.getMemberOfUser(chat, userToken.id));
  }
}

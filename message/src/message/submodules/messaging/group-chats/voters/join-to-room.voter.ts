import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';
import { AbstractMessagingDocument } from '../../../../../message/submodules/platform';
import { WsVoteCodes } from '../../../../../ws/enums';
import { GroupChatDocument, GroupChat } from '../schemas';

@Voter()
export class JoinRoomVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: AbstractMessagingDocument): Promise<boolean> {
    return attribute === WsVoteCodes.JOIN_TO_ROOM && GroupChat.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: GroupChatDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    return Boolean(GroupChat.getMemberOfUser(chat, userToken.id));
  }
}

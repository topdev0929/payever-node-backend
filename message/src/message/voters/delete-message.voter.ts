import { ChatMemberRoleEnum } from '@pe/message-kit';
import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';
import { VoteCodes } from '../const';
import {
  AbstractChatMessageDocument,
  AbstractMessagingDocument,
  ChatTextMessage,
  AbstractMessaging,
} from '../submodules/platform';

@Voter()
export class DeleteMessageVoter extends AbstractVoter {
  protected async supports(attribute: VoteCodes, subject: AbstractChatMessageDocument): Promise<boolean> {
    return attribute === VoteCodes.DELETE_MESSAGE;
  }
  protected async voteOnAttribute(
    attribute: VoteCodes,
    message: AbstractChatMessageDocument,
    { userToken, chat }: { userToken: UserTokenInterface; chat: AbstractMessagingDocument },
  ): Promise<boolean> {
    if (AbstractMessaging.getMemberOfUser(chat, userToken.id)?.role === ChatMemberRoleEnum.Admin) {
      return true;
    }

    return !!(ChatTextMessage.isTypeOf(message) && message.sender === userToken.id);
  }
}


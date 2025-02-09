import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';
import { VoteCodes } from '../const';
import { AbstractChatMessageDocument, AbstractMessagingDocument, ChatTextMessage } from '../submodules/platform';

@Voter()
export class EditMessageVoter extends AbstractVoter {
  protected async supports(attribute: VoteCodes, subject: AbstractChatMessageDocument): Promise<boolean> {
    return attribute === VoteCodes.EDIT_MESSAGE;
  }
  protected async voteOnAttribute(
    attribute: VoteCodes,
    message: AbstractChatMessageDocument,
    { userToken, chat }: { userToken: UserTokenInterface; chat: AbstractMessagingDocument },
  ): Promise<boolean> {
    return ChatTextMessage.isTypeOf(message) && message.sender === userToken.id;
  }
}


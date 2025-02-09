import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';

import { VoteCodes } from '../const';
import { AbstractMessagingDocument, AbstractChatMessageDocument, ChatTextMessage } from '../submodules/platform';

@Voter()
export class MarkMessageReadVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: {
    chat: AbstractMessagingDocument;
    message: AbstractChatMessageDocument;
  }): Promise<boolean> {
    return attribute === VoteCodes.MARK_MESSAGE_READ;
  }

  protected async voteOnAttribute(
    attribute: string,
    subject: {
      chat: AbstractMessagingDocument;
      message: AbstractChatMessageDocument;
    },
    user: UserTokenInterface,
  ): Promise<boolean> {
    if (ChatTextMessage.isTypeOf(subject.message)) {
      return subject.message.sender !== user.id;
    }

    return true;
  }
}

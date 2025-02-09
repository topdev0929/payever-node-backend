import { AbstractVoter, Voter } from '@pe/nest-kit';
import { CustomerChatDocument, CustomerChat } from '../schemas';
import { VoteCodes } from '../../../../const';

@Voter()
export class CreateMessageVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: CustomerChatDocument): Promise<boolean> {
    return attribute === VoteCodes.CREATE_MESSAGE && CustomerChat.isTypeOf(subject);
  }

  protected async voteOnAttribute(attribute: string, subject: CustomerChatDocument): Promise<boolean> {
    //  Customer chat voter in root message module
    //  src/message/voters/customer-chat-create-message.voter.ts
    return false;
  }
}

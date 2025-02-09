import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';

import { VoteCodes } from '../../../../const';
import { CustomerChat, CustomerChatDocument } from '../schemas';
import { UserDocument } from '../../../../../projections/schema';

@Voter()
export class ExcludeMemberVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: CustomerChatDocument): Promise<boolean> {
    return attribute === VoteCodes.EXCLUDE_MEMBER && CustomerChat.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: CustomerChatDocument,
    { userToken, userToExclude }: { userToken: UserTokenInterface; userToExclude?: UserDocument },
  ): Promise<boolean> {
    return true;
  }
}

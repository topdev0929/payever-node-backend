import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';

import { VoteCodes } from '../../../../const';
import { CustomerChatDocument, CustomerChat } from '../schemas';
import { PermissionsService } from '../../../../services/permissions.service';

@Voter()
export class UpdateChatVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: CustomerChatDocument): Promise<boolean> {
    return attribute === VoteCodes.UPDATE_MESSAGING && CustomerChat.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: CustomerChatDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    return PermissionsService.hasUserTokenAccessToBusiness(userToken, chat.business);
  }
}

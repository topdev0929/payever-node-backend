import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';
import { VoteCodes } from '../../../../const';
import { CustomerChat, CustomerChatDocument } from '../schemas';
import { PermissionsService } from '../../../../services/permissions.service';

@Voter()
export class ReadChatMembersVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: CustomerChatDocument): Promise<boolean> {
    return attribute === VoteCodes.READ_MESSAGING_MEMBERS && CustomerChat.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: CustomerChatDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    return PermissionsService.hasUserTokenAccessToBusiness(userToken, chat.business);
  }
}

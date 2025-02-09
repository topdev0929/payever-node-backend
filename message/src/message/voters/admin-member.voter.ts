import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';

import { VoteCodes } from '../const';
import { AbstractMessagingDocument, AbstractMessaging } from '../submodules/platform';

@Voter()
export class AdminRoleVoter extends AbstractVoter {
  protected async supports(attribute: VoteCodes, subject: AbstractMessagingDocument): Promise<boolean> {
    return [
      VoteCodes.UPDATE_MESSAGING,
      VoteCodes.INCLUDE_MEMBER,
      VoteCodes.CREATE_MESSAGE,
      VoteCodes.PIN_MESSAGE,
      VoteCodes.SEND_MEDIA,
    ].includes(attribute);
  }

  protected async voteOnAttribute(
    attribute: VoteCodes,
    chat: AbstractMessagingDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    return AbstractMessaging.hasMemberAdminRole(chat, userToken.id);
  }
}

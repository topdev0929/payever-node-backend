import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';

import { VoteCodes } from '../const';
import {
  AbstractChatMessageDocument,
  AbstractMessagingDocument,
  AbstractMessaging,
} from '../submodules/platform';
import { PermissionsService } from '../services/permissions.service';

@Voter()
export class PinUnpinMessageVoter extends AbstractVoter {
  protected async supports(attribute: VoteCodes, subject: {
    chat: AbstractMessagingDocument;
    message: AbstractChatMessageDocument;
  }): Promise<boolean> {
    return [VoteCodes.PIN_MESSAGE].includes(attribute);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: AbstractMessagingDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    if (AbstractMessaging.hasMemberAdminRole(chat, userToken.id)) {
      return true;
    }

    if (AbstractMessaging.hasPermission(chat, 'pinMessages')) {
      return true;
    }

    return !!(AbstractMessaging.hasBusiness(chat) &&
      PermissionsService.hasUserTokenAccessToBusiness(userToken, chat.business));
  }
}

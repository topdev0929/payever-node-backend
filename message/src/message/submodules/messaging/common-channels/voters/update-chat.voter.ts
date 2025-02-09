import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';

import { VoteCodes } from '../../../../const';
import { CommonChannelDocument, CommonChannel } from '../schemas';
import { ChannelTypeEnum } from '../../../../enums';
import { PermissionsService } from '../../../../services/permissions.service';

@Voter()
export class UpdateChatVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: CommonChannelDocument): Promise<boolean> {
    return attribute === VoteCodes.UPDATE_MESSAGING && CommonChannel.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: CommonChannelDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    if (CommonChannel.memberHasPermission(chat, 'change', userToken.id)) {
      return true;
    }

    return !!(chat.subType === ChannelTypeEnum.Public &&
      PermissionsService.hasUserTokenAccessToBusiness(userToken, chat.business));
  }
}

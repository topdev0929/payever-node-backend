import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';

import { VoteCodes } from '../../../../const';
import { CommonChannelDocument, CommonChannel } from '../schemas';
import { ChannelTypeEnum } from '../../../../enums';
import { ChatMember } from '../../../../submodules/platform';
import { PermissionsService } from '../../../../services/permissions.service';

@Voter()
export class SendMediaVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: CommonChannelDocument): Promise<boolean> {
    return attribute === VoteCodes.SEND_MEDIA && CommonChannel.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: CommonChannelDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    if (ChatMember.hasPermission(CommonChannel.getMemberOfUser(chat, userToken.id), 'sendMedia')) {
      return true;
    }

    if (chat.permissions && !chat.permissions.sendMedia) {
      return false;
    }

    return !!(chat.subType === ChannelTypeEnum.Public &&
      PermissionsService.hasUserTokenAccessToBusiness(userToken, chat.business));
  }
}

import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';
import { VoteCodes } from '../../../../const';
import { CommonChannel, CommonChannelDocument } from '../schemas';
import { ChannelTypeEnum } from '../../../../enums';
import { PermissionsService } from '../../../../services/permissions.service';

@Voter()
export class IncludeToChatVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: CommonChannelDocument): Promise<boolean> {
    return attribute === VoteCodes.INCLUDE_MEMBER && CommonChannel.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: CommonChannelDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    if (CommonChannel.hasMemberAdminRole(chat, userToken.id)) {
      return true;
    }

    if (chat.permissions && !chat.permissions.addMembers) {
      return false;
    }

    if (CommonChannel.getMemberOfUser(chat, userToken.id)) {
      return true;
    }

    return !!(chat.subType === ChannelTypeEnum.Public &&
      PermissionsService.hasUserTokenAccessToBusiness(userToken, chat.business));
  }
}

import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';
import { AbstractMessagingDocument } from '../../../../../message/submodules/platform';
import { WsVoteCodes } from '../../../../../ws/enums';
import { CommonChannel, CommonChannelDocument } from '../schemas';
import { ChannelTypeEnum } from '../../../../enums';
import { PermissionsService } from '../../../../services/permissions.service';

@Voter()
export class JoinRoomVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: AbstractMessagingDocument): Promise<boolean> {
    return attribute === WsVoteCodes.JOIN_TO_ROOM && CommonChannel.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: CommonChannelDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    if (chat.usedInWidget || chat.permissions?.live) {
      return true;
    }
    if (
      chat.subType === ChannelTypeEnum.Public &&
      PermissionsService.hasUserTokenAccessToBusiness(userToken, chat.business)
    ) {
      return true;
    }

    return Boolean(CommonChannel.getMemberOfUser(chat, userToken.id));
  }
}

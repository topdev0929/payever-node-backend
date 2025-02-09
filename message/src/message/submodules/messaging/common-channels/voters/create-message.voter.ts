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
export class CreateMessageVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: CommonChannelDocument): Promise<boolean> {
    return attribute === VoteCodes.CREATE_MESSAGE && CommonChannel.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: CommonChannelDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    if (ChatMember.hasPermission(CommonChannel.getMemberOfUser(chat, userToken.id), 'sendMessages')) {
      return true;
    }

    if (chat.permissions && !chat.permissions.sendMessages) {
      return false;
    }

    if (
      chat.subType === ChannelTypeEnum.Public &&
      PermissionsService.hasUserTokenAccessToBusiness(userToken, chat.business)
    ) {
      return true;
    }
  }
}

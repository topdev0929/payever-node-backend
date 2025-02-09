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
export class ReadChatMembersVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: CommonChannelDocument): Promise<boolean> {
    return attribute === VoteCodes.READ_MESSAGING_MEMBERS && CommonChannel.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: CommonChannelDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    if (chat.subType === ChannelTypeEnum.Public) {
      return true;
    }

    return Boolean(CommonChannel.getMemberOfUser(chat, userToken.id)) ||
      PermissionsService.hasUserTokenAccessToBusiness(userToken, chat.business);
  }
}

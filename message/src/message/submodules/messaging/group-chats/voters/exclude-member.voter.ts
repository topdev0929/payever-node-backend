import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';
import { ChatMemberRoleEnum } from '@pe/message-kit';

import { VoteCodes } from '../../../../const';
import { GroupChat, GroupChatDocument } from '../schemas';
import { UserDocument } from '../../../../../projections/models';
import { ChatMember } from '../../../platform';

@Voter()
export class ExcludeMemberVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: GroupChatDocument): Promise<boolean> {
    return attribute === VoteCodes.EXCLUDE_MEMBER && GroupChat.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: GroupChatDocument,
    { userToken, userToExclude }: { userToken: UserTokenInterface; userToExclude?: UserDocument },
  ): Promise<boolean> {
    const member: ChatMember = chat.members.find((item: ChatMember) => item.user === userToken.id);
    if (member && member.role === ChatMemberRoleEnum.Admin) {
      return true;
    }

    if (userToExclude && userToExclude._id === userToken.id) {
      const admins: ChatMember[] =
        chat.members.filter((item: ChatMember) => item.role === ChatMemberRoleEnum.Admin);

      return !(admins.length === 1 && admins[0].user === userToken.id);
    }

    return false;
  }
}

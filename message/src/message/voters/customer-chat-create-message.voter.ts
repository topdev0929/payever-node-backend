import { Inject } from '@nestjs/common';
import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';
import { ChatMember } from '../submodules/platform';
import { CustomerChatDocument, CustomerChat } from '../submodules/messaging/customer-chat';
import { VoteCodes } from '../const';
import { BlockedUserDocument, BlockedUsersService } from '../submodules/blocked-users';

@Voter()
export class CustomerChatCreateMessageVoter extends AbstractVoter {
  @Inject() private readonly blockedUsersService: BlockedUsersService;
  protected async supports(attribute: string, subject: CustomerChatDocument): Promise<boolean> {
    return attribute === VoteCodes.CREATE_MESSAGE && CustomerChat.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: CustomerChatDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    if (
      chat.members.length === 2 &&
      chat.members.findIndex((item: ChatMember) => item.user === userToken.id) !== -1
    ) {
      const otherUser: ChatMember = chat.members.find(
        (item: ChatMember) => item.user !== userToken.id,
      );

      const blockedUser: BlockedUserDocument = await this.blockedUsersService.getBlockedUser(
        userToken.id,
        otherUser.user,
      );

      if (blockedUser) {
        return false;
      }
    }

    return true;
  }
}

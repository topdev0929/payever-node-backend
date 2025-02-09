import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';
import { ChatMemberRoleEnum } from '@pe/message-kit';
import { AbstractMessagingDocument, AbstractMessaging } from '../submodules/platform';
import { VoteCodes } from '../const';

@Voter()
export class DeleteMessagingVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: AbstractMessagingDocument): Promise<boolean> {
    return attribute === VoteCodes.DELETE_MESSAGING;
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: AbstractMessagingDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    return AbstractMessaging.getMemberOfUser(chat, userToken.id)?.role === ChatMemberRoleEnum.Admin;
  }
}

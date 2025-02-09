import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';

import { VoteCodes } from '../../../../const';
import { SupportChannelDocument, SupportChannel } from '../schemas';
import { ChatMember } from '../../../../submodules/platform';

@Voter()
export class CreateMessageVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: SupportChannelDocument): Promise<boolean> {
    return attribute === VoteCodes.CREATE_MESSAGE && SupportChannel.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: SupportChannelDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    return ChatMember.hasPermission(SupportChannel.getMemberOfUser(chat, userToken.id), 'sendMessages');
  }
}

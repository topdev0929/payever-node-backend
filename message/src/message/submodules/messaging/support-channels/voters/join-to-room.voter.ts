import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';

import { SupportChannelDocument, SupportChannel } from '../schemas';
import { WsVoteCodes } from '../../../../../ws/enums';

@Voter()
export class JoinRoomVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: SupportChannelDocument): Promise<boolean> {
    return attribute === WsVoteCodes.JOIN_TO_ROOM && SupportChannel.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: SupportChannelDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    return true;
  }
}

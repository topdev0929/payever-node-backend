import {
  AbstractVoter,
  Voter,
  UserTokenInterface,
} from '@pe/nest-kit';
import { VoteCodes } from '../../../../const';
import { AppChannel, AppChannelDocument } from '../schemas';

@Voter()
export class AppChannelVoter extends AbstractVoter {
  protected async supports(attribute: VoteCodes, subject: AppChannelDocument): Promise<boolean> {
    return attribute === VoteCodes.READ_MESSAGING && AppChannel.isTypeOf(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: AppChannelDocument,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    return true;
  }
}

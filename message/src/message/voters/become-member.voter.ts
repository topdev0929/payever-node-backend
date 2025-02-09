import {
  AbstractVoter,
  Voter,
} from '@pe/nest-kit';
import { AbstractMessagingDocument } from '../submodules/platform';
import { VoteCodes } from '../const';
import { UserDocument } from 'src/projections/models';
import { ProfileDocument } from '../schemas';
import { StatusEnum } from '../enums';

@Voter()
export class BecomeMemberVoter extends AbstractVoter {

  protected async supports(attribute: string, subject: AbstractMessagingDocument): Promise<boolean> {
    return attribute === VoteCodes.BECOME_MEMBER;
  }

  protected async voteOnAttribute(
    attribute: string,
    chat: AbstractMessagingDocument,
    { user, profile }: { user: UserDocument; profile: ProfileDocument },
  ): Promise<boolean> {
    return !(profile?.privacy?.channelsAndGroups?.canAdd === StatusEnum.Nobody);
  }
}

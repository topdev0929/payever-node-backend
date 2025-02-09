import { AbstractVoter, Voter, UserTokenInterface } from '@pe/nest-kit';
import { BusinessModel } from '@pe/business-kit';
import { VoteCodes } from '../const';
import { PermissionsService } from '../services/permissions.service';

@Voter()
export class CreateMessagingVoter extends AbstractVoter {
  protected async supports(attribute: string, subject: BusinessModel): Promise<boolean> {
    return attribute === VoteCodes.CREATE_MESSAGING;
  }

  protected async voteOnAttribute(
    attribute: string,
    business: BusinessModel,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    return PermissionsService.hasUserTokenAccessToBusiness(userToken, business?._id);
  }
}

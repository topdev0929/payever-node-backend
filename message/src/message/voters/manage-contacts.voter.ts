import { AbstractVoter, Voter, UserTokenInterface } from '@pe/nest-kit';
import { BusinessModel } from '@pe/business-kit';
import { VoteCodes } from '../const';
import { PermissionsService } from '../services/permissions.service';

@Voter()
export class ManageContactsVoter extends AbstractVoter {
  protected async supports(attribute: VoteCodes, subject: BusinessModel): Promise<boolean> {
    return [
      VoteCodes.CREATE_CONTACT,
      VoteCodes.UPDATE_CONTACT,
      VoteCodes.DELETE_CONTACT,
      VoteCodes.READ_CONTACT,
    ].includes(attribute);
  }

  protected async voteOnAttribute(
    attribute: VoteCodes,
    business: BusinessModel,
    { userToken }: { userToken: UserTokenInterface },
  ): Promise<boolean> {
    return PermissionsService.hasUserTokenAccessToBusiness(userToken, business._id);
  }
}

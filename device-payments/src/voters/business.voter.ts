import { Injectable } from '@nestjs/common';
import {
  AbstractVoter,
  AccessTokenPayload,
  RolesEnum,
  Voter,
} from '@pe/nest-kit';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Voter()
@Injectable()
export class BusinessVoter extends AbstractVoter {
  public static readonly businessAccess: string = 'business_access';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return (
      attribute === BusinessVoter.businessAccess &&
      typeof subject === 'string'
    );
  }

  protected async voteOnAttribute(
    attribute: any,
    businessId: string,
    request: any,
  ): Promise<boolean> {
    const user: AccessTokenPayload = request.user;

    return BusinessAccessValidator.isAccessAllowed(user.getRole(RolesEnum.oauth), [], businessId);
  }
}

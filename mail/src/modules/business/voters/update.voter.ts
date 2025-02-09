import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { Injectable } from '@nestjs/common';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Injectable()
@Voter()
export class UpdateVoter extends AbstractVoter {
  public static readonly UPDATE: string = 'update';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === UpdateVoter.UPDATE;
  }

  protected async voteOnAttribute(attribute: string, businessId: string, user: AccessTokenPayload): Promise<boolean> {
    return user && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [
        { microservice: 'marketing', action: AclActionsEnum.update},
      ],
      businessId,
    );
  }
}

import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { Injectable } from '@nestjs/common';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';
@Injectable()
@Voter()
export class DeleteVoter extends AbstractVoter {
  public static readonly DELETE: string = 'delete';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === DeleteVoter.DELETE;
  }

  protected async voteOnAttribute(attribute: string, businessId: string, user: AccessTokenPayload): Promise<boolean> {
    return user && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [
        { microservice: 'marketing', action: AclActionsEnum.delete},
      ],
      businessId,
    );
  }
}

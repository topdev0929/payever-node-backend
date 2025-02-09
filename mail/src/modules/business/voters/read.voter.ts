import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { Injectable } from '@nestjs/common';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Injectable()
@Voter()
export class ReadVoter extends AbstractVoter {
  public static readonly READ: string = 'read';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === ReadVoter.READ;
  }

  protected async voteOnAttribute(attribute: string, businessId: string, user: AccessTokenPayload): Promise<boolean> {
    return user && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [
        { microservice: 'marketing', action: AclActionsEnum.read},
      ],
      businessId,
    );
  }
}

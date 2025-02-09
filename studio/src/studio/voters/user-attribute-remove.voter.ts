import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { UserAttributeInterface } from '../interfaces';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Voter()
@Injectable()
export class UserAttributeRemoveVoter extends AbstractVoter {
  public static readonly REMOVE: string = 'user-attribute-remove';

  constructor(
  ) {
    super();
  }

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === UserAttributeRemoveVoter.REMOVE;
  }

  protected async voteOnAttribute(
    attribute: string,
    userAttribute: UserAttributeInterface,
    user: AccessTokenPayload,
  ): Promise<boolean> {

    return user && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [
        { microservice: 'studio', action: AclActionsEnum.create },
      ],
      userAttribute.businessId,
    );
  }
}

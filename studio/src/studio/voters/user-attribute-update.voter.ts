import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { UserAttributeInterface } from '../interfaces';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Voter()
@Injectable()
export class UserAttributeUpdateVoter extends AbstractVoter {
  public static readonly UPDATE: string = 'user-attribute-update';

  constructor(
  ) {
    super();
  }

  protected async supports(attribute: string, subject: any): Promise<boolean> {

    return attribute === UserAttributeUpdateVoter.UPDATE;
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

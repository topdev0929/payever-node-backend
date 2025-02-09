import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Voter()
@Injectable()
export class UserAttributeGroupUpdateVoter extends AbstractVoter {
  public static readonly UPDATE: string = 'user-attribute-group-update';
  
  constructor(
  ) {
    super();
  }

  protected async supports(attributeGroup: string, subject: any): Promise<boolean> {

    return attributeGroup === UserAttributeGroupUpdateVoter.UPDATE;
  }

  protected async voteOnAttribute(
    attributeGroup: string, 
    data: any,
    user: AccessTokenPayload,
  ): Promise<boolean> {

    return user && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [
        { microservice: 'studio', action: AclActionsEnum.create },
      ],
      data.body.businessId,
    ) && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [
        { microservice: 'studio', action: AclActionsEnum.create },
      ],
      data.userAttributeGroup.business,
    );
  }
}

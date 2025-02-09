import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { UserAttributeGroupInterface } from '../interfaces';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Voter()
@Injectable()
export class UserAttributeGroupReadVoter extends AbstractVoter {
  public static readonly READ: string = 'user-attribute-group-read';

  constructor(
  ) {
    super();
  }

  protected async supports(attributeGroup: string, subject: any): Promise<boolean> {

    return attributeGroup === UserAttributeGroupReadVoter.READ;
  }

  protected async voteOnAttribute(
    attributeGroup: string,
    userAttributeGroup: UserAttributeGroupInterface,
    user: AccessTokenPayload,
  ): Promise<boolean> {

    return user && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [
        { microservice: 'studio', action: AclActionsEnum.create },
      ],
      userAttributeGroup.businessId,
    );
  }
}

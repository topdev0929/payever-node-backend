import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { UserAttributeGroupDto } from '../dto';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Voter()
@Injectable()
export class UserAttributeGroupCreateVoter extends AbstractVoter {
  public static readonly CREATE: string = 'user-attribute-group-create';

  constructor(
  ) {
    super();
  }

  protected async supports(attributeGroup: string, subject: any): Promise<boolean> {

    return attributeGroup === UserAttributeGroupCreateVoter.CREATE;
  }

  protected async voteOnAttribute(
    attributeGroup: string,
    body: UserAttributeGroupDto,
    user: AccessTokenPayload,
  ): Promise<boolean> {

    return user && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [
        { microservice: 'studio', action: AclActionsEnum.create },
      ],
      body.businessId,
    );
  }
}

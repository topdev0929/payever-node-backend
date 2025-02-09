import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { UserAttributeDto } from '../dto';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Voter()
@Injectable()
export class UserAttributeCreateVoter extends AbstractVoter {
  public static readonly CREATE: string = 'user-attribute-create';

  constructor(
  ) {
    super();
  }

  protected async supports(attribute: string, subject: any): Promise<boolean> {

    return attribute === UserAttributeCreateVoter.CREATE;
  }

  protected async voteOnAttribute(
    attribute: string,
    body: UserAttributeDto,
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

import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { UserMediaDto } from '../dto';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Voter()
@Injectable()
export class UserMediaCreateVoter extends AbstractVoter {
  public static readonly CREATE: string = 'user-media-create';

  constructor(
  ) {
    super();
  }

  protected async supports(attribute: string, subject: any): Promise<boolean> {

    return attribute === UserMediaCreateVoter.CREATE && subject instanceof UserMediaDto;
  }

  protected async voteOnAttribute(
    attribute: string,
    body: UserMediaDto,
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

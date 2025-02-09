import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { UserMediaInterface } from '../interfaces';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Voter()
@Injectable()
export class UserMediaReadVoter extends AbstractVoter {
  public static readonly READ: string = 'user-media-read';

  constructor(
  ) {
    super();
  }

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === UserMediaReadVoter.READ;
  }

  protected async voteOnAttribute(
    attribute: string,
    userMedia: UserMediaInterface,
    user: AccessTokenPayload,
  ): Promise<boolean> {

    return user && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [
        { microservice: 'studio', action: AclActionsEnum.read },
      ],
      userMedia.businessId,
    );
  }
}

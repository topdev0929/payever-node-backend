import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { UserMediaInterface } from '../interfaces';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Voter()
@Injectable()
export class UserMediaUpdateVoter extends AbstractVoter {
  public static readonly UPDATE: string = 'user-media-update';

  constructor(
  ) {
    super();
  }

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === UserMediaUpdateVoter.UPDATE;
  }

  protected async voteOnAttribute(
    attribute: string,
    userMedia: UserMediaInterface,
    user: AccessTokenPayload,
  ): Promise<boolean> {

    return user && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [
        { microservice: 'studio', action: AclActionsEnum.update },
      ],
      userMedia.businessId,
    );
  }
}

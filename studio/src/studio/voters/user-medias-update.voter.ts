import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { UserMediaInterface } from '../interfaces';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Voter()
@Injectable()
export class UserMediasUpdateVoter extends AbstractVoter {
  public static readonly UPDATE: string = 'user-medias-update';

  constructor(
  ) {
    super();
  }

  protected async supports(attribute: string, subject: any): Promise<boolean> {

    return attribute === UserMediasUpdateVoter.UPDATE;
  }

  protected async voteOnAttribute(
    attribute: string,
    userMedias: UserMediaInterface[],
    user: AccessTokenPayload,
  ): Promise<boolean> {
    if (!user) {
      return false;
    }

    for (const userMedia of userMedias) {
      if (!BusinessAccessValidator.isAccessAllowed(
        user.getRole(RolesEnum.merchant),
        [
          { microservice: 'studio', action: AclActionsEnum.delete },
        ],
        userMedia.businessId,
      )) {
        return false;
      }
    }

    return true;
  }
}

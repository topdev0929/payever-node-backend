import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { UserMediaInterface } from '../interfaces';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Voter()
@Injectable()
export class UserMediasRemoveVoter extends AbstractVoter {
  public static readonly REMOVE: string = 'user-medias-remove';

  constructor(
  ) {
    super();
  }

  protected async supports(attribute: string, subject: any): Promise<boolean> {

    return attribute === UserMediasRemoveVoter.REMOVE;
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

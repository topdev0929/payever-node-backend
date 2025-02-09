import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { UserAlbumInterface } from '../interfaces';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Voter()
@Injectable()
export class UserAlbumRemoveVoter extends AbstractVoter {
  public static readonly REMOVE: string = 'user-album-remove';

  constructor(
  ) {
    super();
  }

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === UserAlbumRemoveVoter.REMOVE;
  }

  protected async voteOnAttribute(
    attribute: string,
    userAlbum: UserAlbumInterface,
    user: AccessTokenPayload,
  ): Promise<boolean> {

    return user && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [
        { microservice: 'studio', action: AclActionsEnum.read },
      ],
      userAlbum.businessId,
    );
  }
}

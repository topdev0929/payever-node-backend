import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { UserAlbumModel } from '../models';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';
import { UserMediaInterface } from '../interfaces';

@Voter()
@Injectable()
export class UserAlbumReadVoter extends AbstractVoter {
  public static readonly READ: string = 'user-album-read';

  constructor(
  ) {
    super();
  }

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === UserAlbumReadVoter.READ && UserAlbumReadVoter.isUserAlbum(subject);
  }

  protected async voteOnAttribute(
    attribute: string,
    userAlbum: UserAlbumModel,
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

  protected static isUserAlbum(subject: any): subject is UserMediaInterface {
    return subject.name !== undefined;
  }
}

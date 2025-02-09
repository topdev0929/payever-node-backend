import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { UpdateUserAlbumDto } from '../dto';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Voter()
@Injectable()
export class UserAlbumUpdateVoter extends AbstractVoter {
  public static readonly UPDATE: string = 'user-album-update';

  constructor(
  ) {
    super();
  }

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === UserAlbumUpdateVoter.UPDATE && subject.businessId && subject.albumId;
  }

  protected async voteOnAttribute(
    attribute: string,
    body: UpdateUserAlbumDto,
    user: AccessTokenPayload,
  ): Promise<boolean> {

    return user && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [
        { microservice: 'studio', action: AclActionsEnum.update },
      ],
      body.businessId,
    );
  }
}

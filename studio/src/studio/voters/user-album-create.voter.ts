import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { UserAlbumDto } from '../dto';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Voter()
@Injectable()
export class UserAlbumCreateVoter extends AbstractVoter {
  public static readonly CREATE: string = 'user-album-create';

  constructor(
  ) {
    super();
  }

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === UserAlbumCreateVoter.CREATE && subject.businessId && subject.name;
  }

  protected async voteOnAttribute(
    attribute: string,
    body: UserAlbumDto,
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

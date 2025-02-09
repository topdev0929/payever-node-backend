import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';
import { BusinessModel } from '../../business/models';

@Voter()
@Injectable()
export class BlogEditVoter extends AbstractVoter {
  public static readonly EDIT: string = 'edit-blog';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === BlogEditVoter.EDIT;
  }

  protected async voteOnAttribute(
    attribute: string,
    business: BusinessModel,
    user: AccessTokenPayload,
  ): Promise<boolean> {
    return canEdit(user, business);
  }
}

function canEdit(user: AccessTokenPayload, business: BusinessModel): boolean {
  if (!user) {
    return false;
  }

  return user.isAdmin() || BusinessAccessValidator.isAccessAllowed(
    user.getRole(RolesEnum.merchant),
    [
      { microservice: 'blog', action: AclActionsEnum.create },
      { microservice: 'blog', action: AclActionsEnum.update },
      { microservice: 'blog', action: AclActionsEnum.delete },
    ],
    business.id,
  );
}

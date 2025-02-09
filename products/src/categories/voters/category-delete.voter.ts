import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { CategoryModel } from '../models';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Injectable()
@Voter()
export class CategoryDeleteVoter extends AbstractVoter {
  public static readonly DELETE: string = 'category-delete';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === CategoryDeleteVoter.DELETE;
  }

  protected async voteOnAttribute(
    attribute: string,
    category: CategoryModel,
    user: AccessTokenPayload,
  ): Promise<boolean> {
    return user && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [
        { microservice: 'products', action: AclActionsEnum.create},
      ],
      category.businessId,
    );
  }
}

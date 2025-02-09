import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { UpdateCategoryDto } from '../dto';
import { CategoryModel } from '../models';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Injectable()
@Voter()
export class CategoryUpdateVoter extends AbstractVoter {
  public static readonly UPDATE: string = 'category-update';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === CategoryUpdateVoter.UPDATE;
  }

  protected async voteOnAttribute(
    attribute: string,
    category: UpdateCategoryDto | CategoryModel,
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

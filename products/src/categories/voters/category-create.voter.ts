import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { CreateCategoryDto } from '../dto';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Injectable()
@Voter()
export class CategoryCreateVoter extends AbstractVoter {
  public static readonly CREATE: string = 'category-create';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === CategoryCreateVoter.CREATE && subject instanceof CreateCategoryDto;
  }

  protected async voteOnAttribute(
    attribute: string,
    dto: CreateCategoryDto,
    user: AccessTokenPayload,
  ): Promise<boolean> {
    return user && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [
        { microservice: 'products', action: AclActionsEnum.create},
      ],
      dto.businessId,
    );
  }
}

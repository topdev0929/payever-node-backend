import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, UserRoleMerchant, UserRoleOauth, Voter } from '@pe/nest-kit';

import { ProductDto } from '../dto';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Injectable()
@Voter()
export class ProductCreateVoter extends AbstractVoter {
  public static readonly CREATE: string = 'create';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === ProductCreateVoter.CREATE && subject instanceof ProductDto;
  }

  protected async voteOnAttribute(attribute: string, product: ProductDto, user: AccessTokenPayload): Promise<boolean> {
    const roles: UserRoleMerchant | UserRoleOauth | null =
      user.getRole(RolesEnum.merchant) || user.getRole(RolesEnum.oauth);

    return user && BusinessAccessValidator.isAccessAllowed(
      roles,
      [
        { microservice: 'products', action: AclActionsEnum.create },
      ],
      product.businessId,
    );
  }
}

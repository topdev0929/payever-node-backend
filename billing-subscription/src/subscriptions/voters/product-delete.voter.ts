import { AbstractVoter, AccessTokenPayload, RolesEnum, Voter } from '@pe/nest-kit';
import { Injectable } from '@nestjs/common';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

import { ProductModel } from '../models';

@Voter()
@Injectable()
export class ProductDelete extends AbstractVoter {
  public static readonly DELETE: string = 'product-delete';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === ProductDelete.DELETE;
  }

  protected async voteOnAttribute(
    attribute: string,
    product: ProductModel,
    user: AccessTokenPayload,
  ): Promise<boolean> {
    return user && product.businessId && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [],
      product.businessId,
    );
  }
}

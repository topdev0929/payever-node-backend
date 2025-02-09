import { Injectable } from '@nestjs/common';

import { AbstractVoter, AccessTokenPayload, RolesEnum, Voter } from '@pe/nest-kit';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';
import { ProductModel } from '../interfaces/entities';

@Voter()
@Injectable()
export class ProductUpdateVoter extends AbstractVoter {
  public static readonly UPDATE: string = 'product-update';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === ProductUpdateVoter.UPDATE;
  }

  protected async voteOnAttribute(
    attribute: string,
    product: ProductModel,
    user: AccessTokenPayload,
  ): Promise<boolean> {
    await product.populate('business').execPopulate();

    return user && product.business && BusinessAccessValidator.isAccessAllowed(
      user.getRole(RolesEnum.merchant),
      [],
      product.businessId,
    );
  }
}

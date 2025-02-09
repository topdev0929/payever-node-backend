import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, UserRoleMerchant, UserRoleOauth, Voter } from '@pe/nest-kit';

import { ProductDto } from '../dto';
import { Model } from 'mongoose';
import { ProductModel } from '../models';
import { ProductInterface } from '../interfaces';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Injectable()
@Voter()
export class ProductUpdateVoter extends AbstractVoter {
  public static readonly UPDATE: string = 'update';

  constructor(@InjectModel('Product') private readonly productModel: Model<ProductModel>) {
    super();
  }

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === ProductUpdateVoter.UPDATE && subject instanceof ProductDto;
  }

  protected async voteOnAttribute(
    attribute: string,
    productDto: ProductDto,
    user: AccessTokenPayload,
  ): Promise<boolean> {
    if (!user) {
      return false;
    }

    const product: ProductInterface = await this.productModel.findById(productDto.id);
    const roles: UserRoleMerchant | UserRoleOauth | null =
      user.getRole(RolesEnum.merchant) || user.getRole(RolesEnum.oauth);

    return product.businessId === productDto.businessId
      && BusinessAccessValidator.isAccessAllowed(
        roles,
        [
          { microservice: 'products', action: AclActionsEnum.update },
        ],
        product.businessId,
      );
  }
}

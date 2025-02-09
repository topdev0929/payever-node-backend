import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';

import { Model } from 'mongoose';
import { ProductModel } from '../models';
import { ProductInterface } from '../interfaces';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';

@Injectable()
@Voter()
export class ProductDeleteVoter extends AbstractVoter {
  public static readonly DELETE: string = 'delete';

  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductModel>,
  ) { super(); }

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === ProductDeleteVoter.DELETE;
  }

  protected async voteOnAttribute(attribute: string, productIDs: string[], user: AccessTokenPayload): Promise<boolean> {
    if (!user) {
      return false;
    }

    const products: ProductInterface[] = await this.productModel.find({ _id: { $in: productIDs}});
    for (const product of products) {
      const isAllowed: boolean = BusinessAccessValidator.isAccessAllowed(
        user.getRole(RolesEnum.merchant),
        [
          { microservice: 'products', action: AclActionsEnum.delete},
        ],
        product.businessId,
      );

      if (!isAllowed) {
        return false;
      }
    }

    return true;
  }
}

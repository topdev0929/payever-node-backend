import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';
import { ProductIdListDto } from '../dto';
import { ProductModel } from '../models';
import { Model } from 'mongoose';
import { ProductInterface } from '../interfaces';

@Injectable()
@Voter()
export class CollectionAssociateVoter extends AbstractVoter {
  public static readonly ASSOCIATE: string = 'associate-collection';

  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductModel>,
  ) {
    super();
  }

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === CollectionAssociateVoter.ASSOCIATE;
  }

  protected async voteOnAttribute(
    attribute: string,
    productList: ProductIdListDto,
    user: AccessTokenPayload,
  ): Promise<boolean> {

    for (const id of productList.ids) {
      const product: ProductInterface = await this.productModel.findById(id);
      const accessAllowed: boolean = user && BusinessAccessValidator.isAccessAllowed(
        user.getRole(RolesEnum.merchant),
        [
          { microservice: 'products', action: AclActionsEnum.create},
        ],
        product.businessId,
      );

      if (!product || !accessAllowed) {
        return false;
      }
    }

    return true;
  }
}

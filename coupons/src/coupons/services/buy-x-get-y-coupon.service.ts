import { Model, DocumentDefinition } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceTag } from '@pe/nest-kit';

import { ApplyCouponDto } from '../dto';
import {
  CouponTypeBuyOrGetXGetYItemTypeEnum,
  CouponTypeBuyXGetYGetDiscountTypesEnum,
  CouponTypeEnum,
  RabbitEventNamesEnum,
  RabbitExchangesEnum,
} from '../enum';
import { ApplyCouponResponseInterface, CartItemInterface } from '../interfaces';
import { CouponHandlerInterface } from '../listeners';
import {
  Coupon,
  CouponDocument,
  CouponInterface,
  CouponSchemaName,
  CouponTypeBuyXGetY,
  CouponTypeBuyXGetYEmbeddedDocument,
  CouponTypeBuyXGetYInterface,
} from '../schemas';
import { BaseCouponService } from './base-coupon.service';
import { EsFolderItemInterface, FolderDocumentInterface, ListQueryDto, PagingResultDto } from '@pe/folders-plugin';

@Injectable()
@ServiceTag('CouponTypeService')
export class BuyXGetYCouponService
  extends BaseCouponService
  implements CouponHandlerInterface<CouponTypeBuyXGetY, CouponTypeBuyXGetYEmbeddedDocument> {

  @InjectModel(CouponSchemaName)
    protected readonly couponModel: Model<CouponDocument<CouponTypeBuyXGetYEmbeddedDocument>>;

  public isHandlerFor(coupon: Coupon): boolean {
    return coupon.type.type === CouponTypeEnum.BUY_X_GET_Y;
  }

  public create(
    data: DocumentDefinition<CouponDocument<CouponTypeBuyXGetYEmbeddedDocument>>,
  ): Promise<CouponDocument<CouponTypeBuyXGetYEmbeddedDocument>> {
    return this.couponModel.create(data);
  }

  public async applyCoupon(
    coupon: CouponInterface<CouponTypeBuyXGetYInterface>,
    dto: ApplyCouponDto,
    couponId: string,
  ): Promise<ApplyCouponResponseInterface> {
    await this.denyIfNotEligibleBuyXGetY(coupon, dto.cart);

    const query: ListQueryDto = new ListQueryDto();
    query.limit = 10;
    if (coupon.type.getType === CouponTypeBuyOrGetXGetYItemTypeEnum.SPECIFIC_PRODUCTS) {
      query.filters = {
        serviceEntityId: {
          condition: 'isIn',
          value: coupon.type.getProducts,
        },
      };
    } else if (coupon.type.getType === CouponTypeBuyOrGetXGetYItemTypeEnum.SPECIFIC_CATEGORIES) {
      query.filters = {
        category: {
          condition: 'isIn',
          value: coupon.type.getCategories,
        },
      };
    }

    const [getYProducts]: PagingResultDto[] = await this.rabbitMqRPCClient.send(
      {
        channel: RabbitEventNamesEnum.ProductsEsSearch,
        exchange: RabbitExchangesEnum.rpcCalls,
      },
      {
        name: RabbitEventNamesEnum.ProductsEsSearch,
        payload: {
          businessId: coupon.businessId,
          query,
        },
      },
      {
        replyExceptions: true,
        responseType: 'json',
      },
    );

    const getYCartItems: CartItemInterface[] = getYProducts.collection.map(
      (product: EsFolderItemInterface) => {
        return {
          identifier: product.serviceEntityId,
          //  or title?
          name: product.name,
          price: this.getGetYPrice(coupon, product.price),
          quantity: coupon.type.getQuantity,
        };
      },
    );

    const appliedOn: ApplyCouponResponseInterface['appliedOn'] = getYProducts.collection.map(
      (product: EsFolderItemInterface) => ({
        identifier: product.serviceEntityId,
        reduction: this.getGetYDiscount(coupon, product.price),
      }),
    );

    await this.couponUsedService.addUsage(couponId, dto.customerEmail);

    return {
      appliedOn,
      cart: [
        ...dto.cart,
        ...getYCartItems,
      ],
    };
  }

  private async denyIfNotEligibleBuyXGetY(
    coupon: CouponInterface<CouponTypeBuyXGetYInterface>,
    cart: CartItemInterface[],
  ): Promise<void> {
    const filteredCart: CartItemInterface[] = await this.filterAppliesTo(
      cart,
      coupon.businessId,
      coupon.type.buyType,
      coupon.type.buyProducts,
      coupon.type.buyCategories,
    );

    await this.filterMinimumRequirements(
      filteredCart,
      coupon.type.buyRequirementType,
      coupon.type.buyAmount,
      coupon.type.buyQuantity,
    );
  }

  private getGetYPrice(
    coupon: CouponInterface<CouponTypeBuyXGetYInterface>,
    price: number,
  ): number {
    if (coupon.type.getDiscountType === CouponTypeBuyXGetYGetDiscountTypesEnum.FREE) {
      return 0;
    }

    if (coupon.type.getDiscountType === CouponTypeBuyXGetYGetDiscountTypesEnum.PERCENTAGE) {
      return price - price / 100 * coupon.type.getDiscountValue;
    }
  }

  private getGetYDiscount(
    coupon: CouponInterface<CouponTypeBuyXGetYInterface>,
    price: number,
  ): number {
    if (coupon.type.getDiscountType === CouponTypeBuyXGetYGetDiscountTypesEnum.FREE) {
      return price;
    }

    if (coupon.type.getDiscountType === CouponTypeBuyXGetYGetDiscountTypesEnum.PERCENTAGE) {
      return price / 100 * coupon.type.getDiscountValue;
    }
  }
}

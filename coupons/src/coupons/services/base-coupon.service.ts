import { Inject, BadRequestException } from '@nestjs/common';

import {
  CouponInterface,
  CouponTypeFixedAmountInterface,
  CouponTypePercentageInterface,
} from '../schemas';
import { CartItemInterface } from '../interfaces';
import {
  CouponTypeAppliedToEnum,
  CouponTypeBuyOrGetXGetYItemTypeEnum,
  CouponTypeBuyXGetYBuyRequirementsTypeEnum,
  CouponTypeMinimumRequirementsEnum,
  RabbitEventNamesEnum,
  RabbitExchangesEnum,
} from '../enum';
import { CouponUsedService } from './coupon-used.service';
import { ListQueryDto, FolderDocumentInterface, PagingResultDto, EsFolderItemInterface } from '@pe/folders-plugin';
import { RabbitMqRPCClient } from '@pe/nest-kit';

export abstract class BaseCouponService {
  @Inject() protected readonly couponUsedService: CouponUsedService;
  @Inject() protected readonly rabbitMqRPCClient: RabbitMqRPCClient;
  protected async filterCart(
    coupon: CouponInterface<CouponTypePercentageInterface | CouponTypeFixedAmountInterface>,
    cart: CartItemInterface[],
  ): Promise<CartItemInterface[]> {
    const filteredCart: CartItemInterface[] = await this.filterAppliesTo(
      cart,
      coupon.businessId,
      coupon.type.appliesTo,
      coupon.type.appliesToProducts,
      coupon.type.appliesToCategories,
    );

    return this.filterMinimumRequirements(
      filteredCart,
      coupon.type.minimumRequirements,
      coupon.type.minimumRequirementsPurchaseAmount,
      coupon.type.minimumRequirementsQuantityOfItems,
    );
  }

  protected async filterMinimumRequirements(
    cart: CartItemInterface[],
    minimumRequirements: CouponTypeMinimumRequirementsEnum | CouponTypeBuyXGetYBuyRequirementsTypeEnum,
    minimumRequirementsPurchaseAmount: number | null,
    minimumRequirementsQuantityOfItems: number | null,
  ): Promise<CartItemInterface[]> {

    if (minimumRequirements === CouponTypeMinimumRequirementsEnum.MINIMUM_PURCHASE_AMOUNT) {
      const filteredCart: CartItemInterface[] = cart.filter((item: CartItemInterface) => {
        const purchaseAmount: number = item.price * item.quantity;

        return purchaseAmount >= minimumRequirementsPurchaseAmount;
      });

      if (!filteredCart.length) {
        throw new BadRequestException({
          message: `Minimum purchase requirement not satisfied`,
        });
      }

      return filteredCart;
    }

    if (minimumRequirements === CouponTypeMinimumRequirementsEnum.MINIMUM_QUANTITY_OF_ITEMS) {
      const filteredCart: CartItemInterface[] = cart.filter((item: CartItemInterface) => {
        return item.quantity >= minimumRequirementsQuantityOfItems;
      });

      if (!filteredCart.length) {
        throw new BadRequestException({
          message: `Minimum quantitiy not satisfied`,
        });
      }

      return filteredCart;
    }

    return cart;
  }

  protected async filterAppliesTo(
    cart: CartItemInterface[],
    businessId: string,
    appliesTo: CouponTypeAppliedToEnum | CouponTypeBuyOrGetXGetYItemTypeEnum,
    appliesToProducts: string[] | null,
    appliesToCategories: string[] | null,
  ): Promise<CartItemInterface[]> {

    if ([
      CouponTypeAppliedToEnum.SPECIFIC_PRODUCTS,
      CouponTypeBuyOrGetXGetYItemTypeEnum.SPECIFIC_PRODUCTS,
    ].includes(appliesTo)) {

      const filteredCart: CartItemInterface[] = cart.filter(
        (item: CartItemInterface) => appliesToProducts.includes(item.identifier),
      );

      if (!filteredCart.length) {
        throw new BadRequestException({
          message: `Coupon only allowed for specific products`,
        });
      }

      return filteredCart;
    }

    if ([
      CouponTypeAppliedToEnum.SPECIFIC_CATEGORIES,
      CouponTypeBuyOrGetXGetYItemTypeEnum.SPECIFIC_CATEGORIES,
    ].includes(appliesTo)) {
      const query: ListQueryDto = new ListQueryDto();
      query.limit = Math.max(cart.length * 10, 100);
      query.filters = {
        category: {
          condition: 'isIn',
          value: appliesToCategories,
        },
        serviceEntityId: {
          condition: 'isIn',
          value: cart.map((cartItem: CartItemInterface) => cartItem.identifier),
        },
      };

      const [productsInCategories]: PagingResultDto[] = await this.rabbitMqRPCClient.send(
        {
          channel: RabbitEventNamesEnum.ContactsEsSearch,
          exchange: RabbitExchangesEnum.rpcCalls,
        },
        {
          name: RabbitEventNamesEnum.ContactsEsSearch,
          payload: {
            businessId,
            query,
          },
        },
        {
          replyExceptions: true,
          responseType: 'json',
        },
      );

      const filteredCart: CartItemInterface[] = cart.filter((item: CartItemInterface, index: number) => {
        return productsInCategories.collection.some(
          (productsAppProductFolderItem: EsFolderItemInterface) => {
            return productsAppProductFolderItem.serviceEntityId === item.identifier &&
              appliesToCategories.includes(productsAppProductFolderItem.category);
          },
        );
      });

      if (!filteredCart.length) {
        throw new BadRequestException({
          message: `Coupon only allowed for specific products categories`,
        });
      }

      return filteredCart;
    }

    return cart;
  }
}


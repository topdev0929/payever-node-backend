import { fixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';

import {
  CouponDocument,
  CouponSchemaName,
  CouponsTypeFixedAmount,
  CouponTypeBuyXGetY,
  CouponTypeFreeShipping,
  CouponTypePercentage,
} from '../../src/coupons/schemas';
import { couponsFactory } from '../factories/coupons-factory';

import {
  CouponsStatusEnum,
  CouponTypeAppliedToEnum,
  CouponTypeBuyOrGetXGetYItemTypeEnum,
  CouponTypeBuyXGetYBuyRequirementsTypeEnum,
  CouponTypeBuyXGetYGetDiscountTypesEnum,
  CouponTypeCustomerEligibilityEnum,
  CouponTypeEnum,
  CouponTypeFreeShippingTypeEnum,
  CouponTypeMinimumRequirementsEnum,
} from '../../src/coupons/enum';

function getInstance<T>(couponChanges: any) {
    return {
        'businessId': '376f8103-0e09-449a-8538-9384f2f1b992',
        'channelSets': [
            '4a5d4861-ead6-47bc-9c23-e16300e6508b',
        ],
        'code': '0VUFX0Z52ER2',
        'customerEligibility': CouponTypeCustomerEligibilityEnum.SPECIFIC_GROUPS_OF_CUSTOMERS,
        'customerEligibilityCustomerGroups': [],
        'customerEligibilitySpecificCustomers': [
            'eligibility-specific-customs-id',
        ],
        'description': 'a new description',
        'endDate': new Date('2021-06-04T19:00:00.000Z'),
        'isAutomaticDiscount': false,
        'limits': {
            'limitOneUsePerCustomer': true,
            'limitUsage': true,
            'limitUsageAmount': 200,
        },
        'name': 'nameValue',
        'startDate': new Date('2021-05-04T19:00:00.000Z'),
        'status': CouponsStatusEnum.ACTIVE,
        ...couponChanges,
    };
}

export = fixture<CouponDocument>(getModelToken(CouponSchemaName), couponsFactory, [
    getInstance<CouponsTypeFixedAmount>({
        _id: 'limit-one-use-per-customer',
        type: {
            discountValue: 5,
            type: CouponTypeEnum.FIXED_AMOUNT,
        },
    }),
    getInstance<CouponsTypeFixedAmount>({
        _id: 'limit-usage-amount',
        code: 'ABCFX0Z52ER2',
        customerEligibility: CouponTypeCustomerEligibilityEnum.EVERYONE,
        limits: {
          'limitOneUsePerCustomer': false,
          'limitUsage': true,
          'limitUsageAmount': 2,
        },
        type: {
          appliesTo: CouponTypeAppliedToEnum.ALL_PRODUCTS,
          appliesToCategories: [],
          appliesToProducts: [],
          discountValue: 5,
          minimumRequirements: CouponTypeMinimumRequirementsEnum.NONE,
          minimumRequirementsPurchaseAmount: 0,
          minimumRequirementsQuantityOfItems: 0,
          type: CouponTypeEnum.FIXED_AMOUNT,

        },
    }),
    getInstance<CouponsTypeFixedAmount>({
      _id: 'specific-customer',
      code: 'FIXED5SPECCUST',
      customerEligibility: CouponTypeCustomerEligibilityEnum.SPECIFIC_CUSTOMERS,
      customerEligibilitySpecificCustomers: [
          'test1@gmail.com',
      ],
      type: {
          discountValue: 5,
          type: CouponTypeEnum.FIXED_AMOUNT,
      },
    }),
    getInstance<CouponsTypeFixedAmount>({
      _id: 'specific-customer-group',
      code: 'FIXED5GROUPCUST',
      customerEligibility: CouponTypeCustomerEligibilityEnum.SPECIFIC_GROUPS_OF_CUSTOMERS,
      customerEligibilityCustomerGroups: [
          'group-id-1',
      ],
      type: {
          discountValue: 5,
          type: CouponTypeEnum.FIXED_AMOUNT,
      },
    }),
    getInstance<CouponsTypeFixedAmount>({
      _id: 'specific-products',
      code: 'FIXED5EVERYONESPECPROD',
      customerEligibility: CouponTypeCustomerEligibilityEnum.EVERYONE,
      type: {
          appliesTo: CouponTypeAppliedToEnum.SPECIFIC_PRODUCTS,
          appliesToCategories: [],
          appliesToProducts: ['product-id-1'],
          discountValue: 5,
          minimumRequirements: CouponTypeMinimumRequirementsEnum.NONE,
          minimumRequirementsPurchaseAmount: 0,
          minimumRequirementsQuantityOfItems: 0,
          type: CouponTypeEnum.FIXED_AMOUNT,
      },
    }),
    getInstance<CouponsTypeFixedAmount>({
      _id: 'specific-categories',
      code: 'FIXED5EVERYONESPECCAT',
      customerEligibility: CouponTypeCustomerEligibilityEnum.EVERYONE,
      type: {
          appliesTo: CouponTypeAppliedToEnum.SPECIFIC_CATEGORIES,
          appliesToCategories: ['category-id-1'],
          appliesToProducts: [],
          discountValue: 5,
          minimumRequirements: CouponTypeMinimumRequirementsEnum.NONE,
          minimumRequirementsPurchaseAmount: 0,
          minimumRequirementsQuantityOfItems: 0,
          type: CouponTypeEnum.FIXED_AMOUNT,
      },
    }),
    getInstance<CouponsTypeFixedAmount>({
        code: 'FIXED5',
        type: {
            discountValue: 5,
            type: CouponTypeEnum.FIXED_AMOUNT,
        },
    }),
    getInstance<CouponsTypeFixedAmount>({
        _id: 'existing-id',
        code: 'FIXED5EVERYONESPECPROD2',
        customerEligibility: CouponTypeCustomerEligibilityEnum.EVERYONE,
        type: {
            appliesTo: CouponTypeAppliedToEnum.SPECIFIC_PRODUCTS,
            appliesToCategories: [],
            appliesToProducts: ['product-id-1'],
            discountValue: 5,
            minimumRequirements: CouponTypeMinimumRequirementsEnum.NONE,
            minimumRequirementsPurchaseAmount: 0,
            minimumRequirementsQuantityOfItems: 0,
            type: CouponTypeEnum.FIXED_AMOUNT,
        },
    }),
    getInstance<CouponTypePercentage>({
      _id: 'purchase-amount',
      code: 'PERC5EVERYONEMINPA',
      customerEligibility: CouponTypeCustomerEligibilityEnum.EVERYONE,
      type: {
          appliesTo: CouponTypeAppliedToEnum.ALL_PRODUCTS,
          appliesToCategories: [],
          appliesToProducts: [],
          discountValue: 5,
          minimumRequirements: CouponTypeMinimumRequirementsEnum.MINIMUM_PURCHASE_AMOUNT,
          minimumRequirementsPurchaseAmount: 20,
          minimumRequirementsQuantityOfItems: 0,
          type: CouponTypeEnum.PERCENTAGE,
      },
    }),
    getInstance<CouponTypePercentage>({
      _id: 'minimum-quantity',
      code: 'PERC5MINQOI',
      customerEligibility: CouponTypeCustomerEligibilityEnum.EVERYONE,
      type: {
          appliesTo: CouponTypeAppliedToEnum.ALL_PRODUCTS,
          appliesToCategories: [],
          appliesToProducts: [],
          discountValue: 5,
          minimumRequirements: CouponTypeMinimumRequirementsEnum.MINIMUM_QUANTITY_OF_ITEMS,
          minimumRequirementsPurchaseAmount: 0,
          minimumRequirementsQuantityOfItems: 3,
          type: CouponTypeEnum.PERCENTAGE,
      },
    }),
    getInstance<CouponTypeFreeShipping>({
      _id: 'free-shipping-1',
      code: 'FSHIPEVERYONESECCOUNTMQOI',
      customerEligibility: CouponTypeCustomerEligibilityEnum.EVERYONE,
      type: {
          excludeShippingRatesOverCertainAmount: true,
          excludeShippingRatesOverCertainAmountValue: 50,
          freeShippingToCountries: ['de'],
          freeShippingType: CouponTypeFreeShippingTypeEnum.SELECTED_COUNTRIES,
          minimumRequirements: CouponTypeMinimumRequirementsEnum.MINIMUM_QUANTITY_OF_ITEMS,
          minimumRequirementsPurchaseAmount: 0,
          minimumRequirementsQuantityOfItems: 3,
          type: CouponTypeEnum.FREE_SHIPPING,
      },
    }),
    getInstance<CouponTypeFreeShipping>({
      _id: 'free-shipping-2',
      code: 'FSHIPEVERYONESELCOUNTMPA',
      customerEligibility: CouponTypeCustomerEligibilityEnum.EVERYONE,
      type: {
          excludeShippingRatesOverCertainAmount: true,
          excludeShippingRatesOverCertainAmountValue: 50,
          freeShippingToCountries: ['de'],
          freeShippingType: CouponTypeFreeShippingTypeEnum.SELECTED_COUNTRIES,
          minimumRequirements: CouponTypeMinimumRequirementsEnum.MINIMUM_PURCHASE_AMOUNT,
          minimumRequirementsPurchaseAmount: 20,
          minimumRequirementsQuantityOfItems: 0,
          type: CouponTypeEnum.FREE_SHIPPING,

      },
    }),
    getInstance<CouponTypeBuyXGetY>({
      _id: 'buy-x-get-y-1',
      code: 'BA04B76A4B22',
      customerEligibility: CouponTypeCustomerEligibilityEnum.EVERYONE,
      type: {
        buyAmount: 0,
        buyCategories: [],
        buyProducts: ['product-id-1'],
        buyQuantity: 2,
        buyRequirementType: CouponTypeBuyXGetYBuyRequirementsTypeEnum.MINIMUM_QUANTITY_OF_ITEMS,
        buyType: CouponTypeBuyOrGetXGetYItemTypeEnum.SPECIFIC_PRODUCTS,
        getCategories: ['category-id-1'],
        getDiscountType: CouponTypeBuyXGetYGetDiscountTypesEnum.PERCENTAGE,
        getDiscountValue: 5,
        getProducts: [],
        getQuantity: 1,
        getType: CouponTypeBuyOrGetXGetYItemTypeEnum.SPECIFIC_CATEGORIES,
        maxUsesPerOrder: false,
        maxUsesPerOrderValue: 0,
        type: CouponTypeEnum.BUY_X_GET_Y,
      },
    }),
    getInstance<CouponTypeBuyXGetY>({
      _id: 'buy-x-get-y-2',
      code: 'BA04B76A4B21',
      customerEligibility: CouponTypeCustomerEligibilityEnum.EVERYONE,
      type: {
        buyAmount: 0,
        buyCategories: [],
        buyProducts: ['product-id-1'],
        buyQuantity: 2,
        buyRequirementType: CouponTypeBuyXGetYBuyRequirementsTypeEnum.MINIMUM_QUANTITY_OF_ITEMS,
        buyType: CouponTypeBuyOrGetXGetYItemTypeEnum.SPECIFIC_PRODUCTS,
        getCategories: ['category-id-1'],
        getDiscountType: CouponTypeBuyXGetYGetDiscountTypesEnum.FREE,
        getDiscountValue: 0,
        getProducts: [],
        getQuantity: 1,
        getType: CouponTypeBuyOrGetXGetYItemTypeEnum.SPECIFIC_CATEGORIES,
        maxUsesPerOrder: false,
        maxUsesPerOrderValue: 0,
        type: CouponTypeEnum.BUY_X_GET_Y,
      },
    }),
    getInstance<CouponsTypeFixedAmount>({
        _id: 'id-to-delete',
        code: 'BA0987654321',
        type: {
            discountValue: 5,
            type: CouponTypeEnum.FIXED_AMOUNT,
        },
    }),
    getInstance<CouponsTypeFixedAmount>({
        _id: 'id-to-update',
        code: 'AAABBBCCCDDD',
        type: {
            discountValue: 5,
            type: CouponTypeEnum.FIXED_AMOUNT,
        },
    }),
]);

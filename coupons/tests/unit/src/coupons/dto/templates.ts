import { v4 as uuid } from 'uuid';

import {
    CouponsStatusEnum,
    CouponTypeAppliedToEnum,
    CouponTypeCustomerEligibilityEnum,
    CouponTypeEnum,
    CouponTypeMinimumRequirementsEnum,
    CreateCouponDto,
    CouponTypePercentageDto,
    classTransformer,
} from './imports';

// tslint:disable-next-line: typedef
export const getCouponTemplate = (): CreateCouponDto<CouponTypePercentageDto> => ({
    'channelSets': [],
    code: 'ABCDEFGHIJKLMNO',
    'customerEligibility': CouponTypeCustomerEligibilityEnum.EVERYONE,
    'customerEligibilityCustomerGroups': [],
    'customerEligibilitySpecificCustomers': [],
    'description': 'a new description',
    'endDate': new Date('2021-06-04T19:00:00.000Z'),
    isAutomaticDiscount: false,
    'limits': {
        'limitOneUsePerCustomer': true,
        'limitUsage': true,
        'limitUsageAmount': 200,
    },
    'name': 'nameValue',
    'startDate': new Date('2021-05-04T19:00:00.000Z'),
    'status': CouponsStatusEnum.INACTIVE,
    'type': {
        appliesTo: CouponTypeAppliedToEnum.ALL_PRODUCTS,
        appliesToCategories: [],
        appliesToProducts: [],
        discountValue: 4,
        minimumRequirements: CouponTypeMinimumRequirementsEnum.NONE,
        minimumRequirementsPurchaseAmount: 0,
        minimumRequirementsQuantityOfItems: 0,
        type: CouponTypeEnum.PERCENTAGE,
    },
});

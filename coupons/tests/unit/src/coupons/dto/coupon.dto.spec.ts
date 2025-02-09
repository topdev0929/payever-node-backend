import 'mocha';
import { expect } from 'chai';

import { v4 as uuid } from 'uuid';
import {
    Validator,
    ValidationError,
} from 'class-validator';
import * as classTransformer from 'class-transformer';
import {
    CouponTypeCustomerEligibilityEnum,
} from '../../../../../src/coupons/enum';
import {
    CreateCouponDto,
    CouponLimitDto,
    CouponTypePercentageDto,
} from '../../../../../src/coupons/dto';

import { getCouponTemplate } from './templates';
import { validateOptions } from '../../../const';

describe('Coupons', () => {
    const validator: Validator = new Validator();
    let couponToValidate: CreateCouponDto<CouponTypePercentageDto>;
    beforeEach(() => {
        const template: CreateCouponDto<CouponTypePercentageDto> = getCouponTemplate();
        couponToValidate = classTransformer.plainToClass(CreateCouponDto<CouponTypePercentageDto>, template);
    });
    it('should transform proper', () => {
        expect(Object.getPrototypeOf(couponToValidate.limits).constructor).to.equal(CouponLimitDto);
    });
    it('should pass if no end Date provided', () => {
        delete couponToValidate.endDate;
        const result: ValidationError[] = validator.validateSync(couponToValidate, validateOptions);
        expect(result).to.deep.equal([]);
    });
    it('should pass if end Date is null', () => {
        couponToValidate.endDate = null;
        const result: ValidationError[] = validator.validateSync(couponToValidate, validateOptions);
        expect(result).to.deep.equal([]);
    });

    describe('coupon customer eligibility', () => {
        describe(CouponTypeCustomerEligibilityEnum.EVERYONE, () => {
            describe('positive', () => {
                it('should pass if customerEligibility is EVERYONE and subfields are invalid', () => {
                    couponToValidate.customerEligibility = CouponTypeCustomerEligibilityEnum.EVERYONE,
                        couponToValidate.customerEligibilityCustomerGroups = 4 as any;
                    couponToValidate.customerEligibilitySpecificCustomers = 5 as any;
                    const result: ValidationError[] = validator.validateSync(couponToValidate, validateOptions);
                    expect(result).to.deep.equal([]);
                });
            });
        });
        describe(CouponTypeCustomerEligibilityEnum.SPECIFIC_CUSTOMERS, () => {
            describe('positive', () => {
                it('should pass if customerEligibility is SPECIFIC_CUSTOMERS', () => {
                    couponToValidate.customerEligibility = CouponTypeCustomerEligibilityEnum.SPECIFIC_CUSTOMERS,
                        couponToValidate.customerEligibilityCustomerGroups = 5 as any;
                    couponToValidate.customerEligibilitySpecificCustomers = [uuid()];
                    const result: ValidationError[] = validator.validateSync(couponToValidate, validateOptions);
                    expect(result).to.deep.equal([]);
                });
            });
            describe('negative', () => {
                it('should not pass if customerEligibility is SPECIFIC_CUSTOMERS', () => {
                    couponToValidate.customerEligibility =
                        CouponTypeCustomerEligibilityEnum.SPECIFIC_CUSTOMERS,
                        couponToValidate.customerEligibilityCustomerGroups = 4 as any;
                    couponToValidate.customerEligibilitySpecificCustomers = 5 as any;
                    const result: ValidationError[] = validator.validateSync(couponToValidate, validateOptions);
                    expect(result).not.to.deep.equal([]);
                });
            });
        });
        describe(CouponTypeCustomerEligibilityEnum.SPECIFIC_GROUPS_OF_CUSTOMERS, () => {
            describe('negative', () => {
                it('should not pass if customerEligibility is SPECIFIC_GROUPS_OF_CUSTOMERS', () => {
                    couponToValidate.customerEligibility =
                        CouponTypeCustomerEligibilityEnum.SPECIFIC_GROUPS_OF_CUSTOMERS,
                        couponToValidate.customerEligibilityCustomerGroups = 4 as any;
                    couponToValidate.customerEligibilitySpecificCustomers = 5 as any;
                    const result: ValidationError[] = validator.validateSync(couponToValidate, validateOptions);
                    expect(result).not.to.deep.equal([]);
                });
            });
        });
    });
    describe('limit', () => {
        describe('positive', () => {
            it('should pass if limit usage is false and limitUsageAmount is invalid', () => {
                couponToValidate.limits.limitUsage = false;
                couponToValidate.limits.limitUsageAmount = -1;
                const result: ValidationError[] = validator.validateSync(couponToValidate, validateOptions);
                expect(result).to.deep.equal([]);
            });
            it('should pass if limit usage is true and limitUsageAmount valid', () => {
                couponToValidate.limits.limitUsage = false;
                couponToValidate.limits.limitUsageAmount = 50;
                const result: ValidationError[] = validator.validateSync(couponToValidate, validateOptions);
                expect(result).to.deep.equal([]);
            });
            it('should pass if limit usage is true and limitUsageAmount is 0', () => {
                couponToValidate.limits.limitUsage = false;
                couponToValidate.limits.limitUsageAmount = 0;
                const result: ValidationError[] = validator.validateSync(couponToValidate, validateOptions);
                expect(result).to.deep.equal([]);
            });
        });
        describe('negative', () => {
            it('should fail if limit usage is true and limitUsageAmount is negative', () => {
                couponToValidate.limits.limitUsage = true;
                couponToValidate.limits.limitUsageAmount = -1;
                const result: ValidationError[] = validator.validateSync(couponToValidate, validateOptions);
                expect(result).not.to.deep.equal([]);
            });
            it('should fail if limit usage is true and limitUsageAmount is not int', () => {
                couponToValidate.limits.limitUsage = true;
                couponToValidate.limits.limitUsageAmount = 5.5;
                const result: ValidationError[] = validator.validateSync(couponToValidate, validateOptions);
                expect(result).not.to.deep.equal([]);
            });
        });
    });
});

describe('Coupons type inside of coupon', () => {
    const validator: Validator = new Validator();
    let couponToValidate: CreateCouponDto<CouponTypePercentageDto>;
    beforeEach(() => {
        couponToValidate = classTransformer.plainToClass(CreateCouponDto<CouponTypePercentageDto>, getCouponTemplate());
    });
    describe('type prop', () => {
        it('should transform coupon to correctly classes', () => {
            expect(Object.getPrototypeOf(couponToValidate).constructor).to.equal(CreateCouponDto);
            expect(Object.getPrototypeOf(couponToValidate.type).constructor).to.equal(CouponTypePercentageDto);
        });
        describe('positive', () => {
            it('should pass validation if coupon is valid', () => {
                const result: ValidationError[] = validator.validateSync(couponToValidate, validateOptions);
                expect(result).to.deep.equal([]);
            });
        });
        describe('negative', () => {
            it('should fail if coupon type is not valid', () => {
                couponToValidate.type.type = 'INVALIDVALUE' as any;
                const result: ValidationError[] = validator.validateSync(couponToValidate, validateOptions);
                expect(result).not.to.deep.equal([]);
            });
            it('should fail if coupon type not contain required property', () => {
                delete (couponToValidate as CreateCouponDto<CouponTypePercentageDto>).type.discountValue;
                const result: ValidationError[] = validator.validateSync(couponToValidate, validateOptions);
                expect(result).not.to.deep.equal([]);
            });
        });
    });
});

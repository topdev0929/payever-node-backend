import 'mocha';
import { expect } from 'chai';

import { plainToClass } from 'class-transformer';

import {
    CouponTypeBuyXGetYDto,
    CouponTypeBuyXGetYBuyRequirementsTypeEnum,
    CouponTypeBuyOrGetXGetYItemTypeEnum,
    CouponTypeBuyXGetYGetDiscountTypesEnum,
    CouponTypeEnum,
    ValidationError,
    classValidator,
} from '../imports';
import { validateOptions } from '../../../../const';

describe('coupon type buy x get y', () => {
    let objectToValidate: CouponTypeBuyXGetYDto;
    beforeEach(() => {
        objectToValidate = new CouponTypeBuyXGetYDto();
        objectToValidate.buyRequirementType = CouponTypeBuyXGetYBuyRequirementsTypeEnum.MINIMUM_QUANTITY_OF_ITEMS;
        objectToValidate.buyQuantity = 5;
        objectToValidate.buyType = CouponTypeBuyOrGetXGetYItemTypeEnum.SPECIFIC_PRODUCTS;
        objectToValidate.buyProducts = ['376f8103-0e09-449a-8548-a384f2f1b014'];
        objectToValidate.buyCategories = [];

        objectToValidate.getType = CouponTypeBuyOrGetXGetYItemTypeEnum.SPECIFIC_PRODUCTS;
        objectToValidate.getQuantity = 1;
        objectToValidate.getProducts = ['376f8103-0e09-449a-8548-a384f2f1b014'];
        objectToValidate.getCategories = [];

        objectToValidate.getDiscountType = CouponTypeBuyXGetYGetDiscountTypesEnum.PERCENTAGE;
        objectToValidate.getDiscountValue = 25;

        objectToValidate.maxUsesPerOrder = false;
        objectToValidate.maxUsesPerOrderValue = 0;

        objectToValidate.type = CouponTypeEnum.BUY_X_GET_Y;
    });
    it('should pass validation', () => {
        const result: ValidationError[] = classValidator.validateSync(objectToValidate, validateOptions);
        expect(result).to.deep.equal([]);
    });
    describe('buy type', () => {
        describe('positive', () => {
            it('should pass if buy type is SPECIFIC_PRODUCTS and get categories is invalid', () => {
                objectToValidate.getType = CouponTypeBuyOrGetXGetYItemTypeEnum.SPECIFIC_PRODUCTS;
                objectToValidate.getCategories = { invalid: 'object' } as any as [];
                const result: ValidationError[] = classValidator.validateSync(objectToValidate, validateOptions);
                expect(result).to.deep.equal([]);
            });
        });
        describe('negative', () => {
            it('should not pass if buy type is SPECIFIC_PRODUCTS and get products is invalid', () => {
                objectToValidate.getType = CouponTypeBuyOrGetXGetYItemTypeEnum.SPECIFIC_PRODUCTS;
                objectToValidate.getProducts = { invalid: 'object' } as any as [];
                const result: ValidationError[] = classValidator.validateSync(objectToValidate, validateOptions);
                expect(result).not.to.deep.equal([]);
            });
        });
    });
    describe('discount', () => {
        describe('positive', () => {
            it('should pass if discount type is free and value is invalid', () => {
                objectToValidate.getDiscountType = CouponTypeBuyXGetYGetDiscountTypesEnum.FREE,
                objectToValidate.getDiscountValue = 'abc' as any as number;
                const result: ValidationError[] = classValidator.validateSync(objectToValidate, validateOptions);
                expect(result).to.deep.equal([]);
            });
            it('should pass if discount type is percentage and value is valid', () => {
                objectToValidate.getDiscountType = CouponTypeBuyXGetYGetDiscountTypesEnum.PERCENTAGE,
                objectToValidate.getDiscountValue = 4;
                const result: ValidationError[] = classValidator.validateSync(objectToValidate, validateOptions);
                expect(result).to.deep.equal([]);
            });
        });
        describe('negative', () => {
            it('should not pass if discount type is percentage and value is invalid', () => {
                objectToValidate.getDiscountType = CouponTypeBuyXGetYGetDiscountTypesEnum.PERCENTAGE,
                objectToValidate.getDiscountValue = 'abc' as any as number;
                const result: ValidationError[] = classValidator.validateSync(objectToValidate, validateOptions);
                expect(result).not.to.deep.equal([]);
            });
            it('should not pass if discount type is percentage and value is 0', () => {
                objectToValidate.getDiscountType = CouponTypeBuyXGetYGetDiscountTypesEnum.PERCENTAGE,
                objectToValidate.getDiscountValue = 0;
                const result: ValidationError[] = classValidator.validateSync(objectToValidate, validateOptions);
                expect(result).not.to.deep.equal([]);
            });
            it('should not pass if discount type is percentage and value lower then 0', () => {
                objectToValidate.getDiscountType = CouponTypeBuyXGetYGetDiscountTypesEnum.PERCENTAGE,
                objectToValidate.getDiscountValue = -5;
                const result: ValidationError[] = classValidator.validateSync(objectToValidate, validateOptions);
                expect(result).not.to.deep.equal([]);
            });
            it('should not pass if discount type is percentage and value lower is not int', () => {
                objectToValidate.getDiscountType = CouponTypeBuyXGetYGetDiscountTypesEnum.PERCENTAGE,
                objectToValidate.getDiscountValue = 2.5;
                const result: ValidationError[] = classValidator.validateSync(objectToValidate, validateOptions);
                expect(result).not.to.deep.equal([]);
            });
        });
    });
});

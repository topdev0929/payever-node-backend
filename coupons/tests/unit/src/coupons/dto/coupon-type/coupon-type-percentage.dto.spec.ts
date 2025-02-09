import 'mocha';
import { expect } from 'chai';

import { v4 as uuid } from 'uuid';
import {
    Validator,
    ValidationError,
    CouponTypeAppliedToEnum,
    CouponTypeEnum,
    CouponTypeMinimumRequirementsEnum,
    CouponTypePercentageDto,
} from '../imports';
import { validateOptions } from '../../../../const';

describe('Percentage coupon type', () => {
    const validator: Validator = new Validator();
    let objectToValidate: CouponTypePercentageDto;
    beforeEach(() => {
        objectToValidate = new CouponTypePercentageDto();
        objectToValidate.appliesTo = CouponTypeAppliedToEnum.ALL_PRODUCTS;
        objectToValidate.appliesToCategories = [];
        objectToValidate.appliesToProducts = [];
        objectToValidate.minimumRequirements = CouponTypeMinimumRequirementsEnum.NONE;
        objectToValidate.minimumRequirementsPurchaseAmount = 12.50;
        objectToValidate.minimumRequirementsQuantityOfItems = 10;
        objectToValidate.type = CouponTypeEnum.PERCENTAGE;
        objectToValidate.discountValue = 5;
    });
    it('should pass validation with valid value in type', () => {
        const validationResult: ValidationError[] = validator.validateSync(objectToValidate, validateOptions);
        expect(validationResult).deep.equals([]);
    });
    describe('discount value', () => {
        describe('negative', () => {
            it('should fail if discount value is negative', () => {
                objectToValidate.discountValue = -1;
                const result: ValidationError[] = validator.validateSync(objectToValidate, validateOptions);
                expect(result).not.to.deep.equal([]);
            });
            it('should fail if discount value is not int', () => {
                objectToValidate.discountValue = 'abc' as any;
                const result: ValidationError[] = validator.validateSync(objectToValidate, validateOptions);
                expect(result).not.to.deep.equal([]);
            });
        });
    });
    describe('applies to', () => {
        beforeEach(() => {
            objectToValidate.appliesTo = CouponTypeAppliedToEnum.ALL_PRODUCTS;
            delete objectToValidate.appliesToCategories;
            delete objectToValidate.appliesToProducts;
        });
        describe('ALL_PRODUCTS', () => {
            describe('positive', () => {
                it('should pass if applies to is ALL_PRODUCTS and no subfields exists', () => {
                    const result: ValidationError[] = validator.validateSync(objectToValidate, validateOptions);
                    expect(result).to.deep.equal([]);
                });
            });
        });
        describe('SPECIFIC_CATEGORIES', () => {
            describe('positive', () => {
                it('should pass if applies to is SPECIFIC_CATEGORIES', () => {
                    objectToValidate.appliesTo = CouponTypeAppliedToEnum.SPECIFIC_CATEGORIES;
                    objectToValidate.appliesToCategories = [uuid()];
                    objectToValidate.appliesToProducts = ['a', NaN, true] as any[];
                    const result: ValidationError[] = validator.validateSync(objectToValidate, validateOptions);
                    expect(result).to.deep.equal([]);
                });
            });
            describe('negative', () => {
                it('should not pass if applies to is SPECIFIC_CATEGORIES', () => {
                    objectToValidate.appliesTo = CouponTypeAppliedToEnum.SPECIFIC_CATEGORIES;
                    objectToValidate.appliesToCategories = ['a', NaN, true] as any[];
                    const result: ValidationError[] = validator.validateSync(objectToValidate, validateOptions);
                    expect(result).not.to.deep.equal([]);
                });
            });
        });
        describe('SPECIFIC_PRODUCTS', () => {
            describe('positive', () => {
                it('should pass if applies to is SPECIFIC_PRODUCTS', () => {
                    objectToValidate.appliesTo = CouponTypeAppliedToEnum.SPECIFIC_PRODUCTS;
                    objectToValidate.appliesToProducts = [uuid()];
                    objectToValidate.appliesToCategories = ['a', NaN, true] as any[];
                    const result: ValidationError[] = validator.validateSync(objectToValidate, validateOptions);
                    expect(result).to.deep.equal([]);
                });
            });
            describe('negaive', () => {
                it('should not pass if applies to is SPECIFIC_PRODUCTS as appliesToProducts is invalid', () => {
                    objectToValidate.appliesTo = CouponTypeAppliedToEnum.SPECIFIC_PRODUCTS;
                    objectToValidate.appliesToProducts = ['a', NaN, true] as any[];
                    const result: ValidationError[] = validator.validateSync(objectToValidate, validateOptions);
                    expect(result).not.to.deep.equal([]);
                });
            });
        });
    });
    describe('minimal requirements', () => {
        beforeEach(() => {
            objectToValidate.minimumRequirementsQuantityOfItems = 5;
            objectToValidate.minimumRequirementsPurchaseAmount = 5;
        });
        describe('MINIMUM_QUANTITY_OF_ITEMS', () => {
            beforeEach(() => {
                objectToValidate.minimumRequirements = CouponTypeMinimumRequirementsEnum.MINIMUM_QUANTITY_OF_ITEMS;
            });
            it('should pass', () => {
                const validationResult: ValidationError[] =
                    validator.validateSync(objectToValidate, validateOptions);
                expect(validationResult).deep.equals([]);
            });
            describe('negative', () => {
                it('should not pass if minimumRequirementsQuantityOfItems is negative', () => {
                    objectToValidate.minimumRequirementsQuantityOfItems = -1;
                    const validationResult: ValidationError[] =
                        validator.validateSync(objectToValidate, validateOptions);
                    expect(validationResult).not.deep.equals([]);
                });
                it('should not pass if minimumRequirementsQuantityOfItems is string', () => {
                    objectToValidate.minimumRequirementsQuantityOfItems = '2' as any as number;
                    const validationResult: ValidationError[] =
                        validator.validateSync(objectToValidate, validateOptions);
                    expect(validationResult).not.deep.equals([]);
                });
                it('should not pass if minimumRequirementsQuantityOfItems is decimal', () => {
                    objectToValidate.minimumRequirementsQuantityOfItems = 15.9;
                    const validationResult: ValidationError[] =
                        validator.validateSync(objectToValidate, validateOptions);
                    expect(validationResult).not.deep.equals([]);
                });
            });
        });
        describe('MINIMUM_PURCHASE_AMOUNT', () => {
            beforeEach(() => {
                objectToValidate.minimumRequirements = CouponTypeMinimumRequirementsEnum.MINIMUM_PURCHASE_AMOUNT;
            });
            it('should pass', () => {
                const validationResult: ValidationError[] =
                    validator.validateSync(objectToValidate, validateOptions);
                expect(validationResult).deep.equals([]);
            });
            describe('negaive', () => {
                it('should not pass if minimumRequirementsPurchaseAmount is negative', () => {
                    objectToValidate.minimumRequirementsPurchaseAmount = -1;
                    const validationResult: ValidationError[] =
                        validator.validateSync(objectToValidate, validateOptions);
                    expect(validationResult).not.deep.equals([]);
                });
                it('should not pass if minimumRequirementsPurchaseAmount is string', () => {
                    objectToValidate.minimumRequirementsPurchaseAmount = '2' as any as number;
                    const validationResult: ValidationError[] =
                        validator.validateSync(objectToValidate, validateOptions);
                    expect(validationResult).not.deep.equals([]);
                });
            });
        });
    });
});

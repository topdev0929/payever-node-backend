import 'mocha';
import { expect } from 'chai';

import {
    CouponTypeEnum,
    ValidationError,
    classValidator,
    CouponTypeFreeShippingDto,
    CouponTypeMinimumRequirementsEnum,
    CouponTypeFreeShippingTypeEnum,
} from '../imports';
import { validateOptions } from '../../../../const';

describe('coupon type free shipping', () => {
    let freeShippingType: CouponTypeFreeShippingDto;
    beforeEach(() => {
        freeShippingType = new CouponTypeFreeShippingDto();
        freeShippingType.minimumRequirements = CouponTypeMinimumRequirementsEnum.NONE;
        freeShippingType.minimumRequirementsPurchaseAmount = 0;
        freeShippingType.minimumRequirementsQuantityOfItems = 0;
        freeShippingType.excludeShippingRatesOverCertainAmount = false;
        freeShippingType.excludeShippingRatesOverCertainAmountValue = 0;
        freeShippingType.freeShippingToCountries = [];
        freeShippingType.freeShippingType = CouponTypeFreeShippingTypeEnum.ALL_COUNTRIES;
        freeShippingType.type = CouponTypeEnum.FREE_SHIPPING;
    });
    describe('free shipping type', () => {
        describe('positive', () => {
            it('should pass if freeShippingType is ALL_COUNTRIES', () => {
                freeShippingType.freeShippingType = CouponTypeFreeShippingTypeEnum.ALL_COUNTRIES;
                freeShippingType.freeShippingToCountries = { value: 'invalid' } as any;
                const result: ValidationError[] = classValidator.validateSync(freeShippingType, validateOptions);
                expect(result).to.deep.equal([]);
            });
            it('should pass if freeShippingType is SELECTED_COUNTRIES', () => {
                freeShippingType.freeShippingType = CouponTypeFreeShippingTypeEnum.SELECTED_COUNTRIES;
                const gb: string = 'GB';
                const ru: string = 'RU';
                freeShippingType.freeShippingToCountries = [gb, ru];
                const result: ValidationError[] = classValidator.validateSync(freeShippingType, validateOptions);
                expect(result).to.deep.equal([]);
            });
        });
        describe('negative', () => {
            it('should not pass if freeShippingType is SELECTED_COUNTRIES', () => {
                freeShippingType.freeShippingType = CouponTypeFreeShippingTypeEnum.SELECTED_COUNTRIES;
                freeShippingType.freeShippingToCountries = [1, 2, 3] as any as [];
                const result: ValidationError[] = classValidator.validateSync(freeShippingType, validateOptions);
                expect(result).not.to.deep.equal([]);
            });
        });
    });
    describe('exclude shipping rates over certain amount', () => {
        describe('positive', () => {
            it('should pass if excludeShippingRatesOverCertainAmount is true', () => {
                freeShippingType.excludeShippingRatesOverCertainAmount = true;
                freeShippingType.excludeShippingRatesOverCertainAmountValue = 500;
                const result: ValidationError[] = classValidator.validateSync(freeShippingType, validateOptions);
                expect(result).to.deep.equal([]);
            });
        });
        describe('negative', () => {
            it('should not pass if excludeShippingRatesOverCertainAmount is true', () => {
                freeShippingType.excludeShippingRatesOverCertainAmount = true;
                freeShippingType.excludeShippingRatesOverCertainAmountValue = [] as any as number;
                const result: ValidationError[] = classValidator.validateSync(freeShippingType, validateOptions);
                expect(result).not.to.deep.equal([]);
            });
        });
    });
});

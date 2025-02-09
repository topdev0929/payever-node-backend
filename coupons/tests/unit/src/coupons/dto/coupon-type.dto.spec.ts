import 'mocha';
import { expect } from 'chai';

import * as classValidator from 'class-validator';

import {
    CouponTypePercentageDto,
    CouponTypeAppliedToEnum,
    CouponTypeMinimumRequirementsEnum,
    ValidationError,

 } from './imports';
import { validateOptions } from './../../../const';

describe('coupon type dto', () => {
    it('should not pass validation with invalid value in type', () => {
        const objectToValidate: CouponTypePercentageDto = new CouponTypePercentageDto();
        objectToValidate.appliesTo = CouponTypeAppliedToEnum.ALL_PRODUCTS;
        objectToValidate.minimumRequirements = CouponTypeMinimumRequirementsEnum.NONE;
        objectToValidate.type = 'invalid' as any;
        objectToValidate.discountValue = 5;
        const validationResult: ValidationError[] = classValidator.validateSync(objectToValidate, validateOptions);
        expect(validationResult[0].constraints).deep.equal({
            isEnum: 'type must be a valid enum value',
        });
    });
});

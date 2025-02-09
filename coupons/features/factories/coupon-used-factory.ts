import { partialFactory, PartialFactory } from '@pe/cucumber-sdk';
import { CouponUsedInterface } from '../../src/coupons/interfaces';

const defaultFactory: () => any = () => {
    return { };
};

export const couponUsedFactory: PartialFactory<CouponUsedInterface> = partialFactory(defaultFactory);

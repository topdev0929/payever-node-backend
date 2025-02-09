// tslint:disable no-string-literal
import 'mocha';
import { expect } from 'chai';

import * as sinon from 'sinon';

import { Model } from 'mongoose';
import { EventDispatcher } from '@pe/nest-kit';

import { Coupon, CouponDocument as CouponModel, CouponsTypeFixedAmount } from '../../../../../src/coupons/schemas';
import { CouponsService } from '../../../../../src/coupons/services/coupons.service';
import {
  CreateCouponDto,
} from '../dto/imports';
import { AppliesToResponseDto as AppliesToResponse } from '../../../../../src/coupons/dto';
describe('Coupons service', () => {
  let service: CouponsService;
  let couponModelMock: Model<CouponModel>;
  let eventDispatcheMock: EventDispatcher;
  let createFn: sinon.SinonSpy;
  beforeEach(() => {
    couponModelMock = ({ }) as Model<CouponModel>;
    eventDispatcheMock = ({
      dispatch: () => { },
    }) as undefined as EventDispatcher;
    service = new CouponsService(
      null,
      eventDispatcheMock,
    );
    createFn = sinon.spy();
    couponModelMock.create = createFn;
  });
  describe('positive', () => {
    it('should read coupon read-coupon-extra', async () => {
      const result: AppliesToResponse = await service.readCouponExtra(
        {
          _id: 'couponId',
        businessId: 'businessId',
        type: {
          type: 'INVALID' as any,
        },
        } as Coupon<CouponsTypeFixedAmount>,
      );
      expect(result).to.null;
    });
  });
  it('should fail if try to change code', (done: Mocha.Done) => {
    service.update({
      code: '1',
    } as CouponModel,
      {
        code: '2',
      } as CreateCouponDto).then(() => {
        done(true);
      }).catch(() => {
        done();
      });
  });
});

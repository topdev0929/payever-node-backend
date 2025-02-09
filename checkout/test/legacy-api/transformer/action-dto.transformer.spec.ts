import 'mocha';
import * as sinon from 'sinon';
import { chaiAssert } from '../../common/chai-helpers';
import { AuthorizeActionDto, CancelActionDto, EditActionDto, RefundActionDto, ShippingGoodsActionDto } from '../dto';
import { ActionDtoTransformer } from './action-dto.transformer';

const assert = chaiAssert;

describe('ActionDtoTransformer', () => {
  let sandbox;

  beforeEach(async () => {
    sandbox = await sinon.createSandbox();
  });

  afterEach(async () => {
    await sandbox.restore();
    sandbox = undefined;
  });

  describe('Transform request body to action dto', () => {
    context('Transform request body to refund action dto', () => {
      it('should return RefundActionDto', () => {
        const dto = {
          amount: 100.0,
        };

        const result: RefundActionDto = ActionDtoTransformer.actionToRequestDTO('refund', dto);

        assert.instanceOf(result, RefundActionDto);
        assert.equal(result.amount, 100.0);
      });
    });

    context('Transform request body to cancel action dto', () => {
      it('should return CancelActionDto', () => {
        const dto = {
          amount: 100.0,
        };

        const result: CancelActionDto = ActionDtoTransformer.actionToRequestDTO('cancel', dto);

        assert.instanceOf(result, CancelActionDto);
        assert.equal(result.amount, 100.0);
      });
    });

    context('Transform request body to edit action dto', () => {
      it('should return EditActionDto', () => {
        const dto = {
          amount: 100.0,
          delivery_fee: 5.0,
          payment_items: ['item'],
        };

        const result: EditActionDto = ActionDtoTransformer.actionToRequestDTO('edit', dto);

        assert.instanceOf(result, EditActionDto);
        assert.equal(result.amount, 100.0);
        assert.equal(result.delivery_fee, 5.0);
        assert.lengthOf(result.payment_items, 1);
        assert.include(result.payment_items, 'item');
      });
    });

    context('Transform request body to shipping goods action dto', () => {
      it('should return ShippingGoodsActionDto', () => {
        const dto = {
          amount: 100.0,
        };

        const result: ShippingGoodsActionDto = ActionDtoTransformer.actionToRequestDTO('shipping_goods', dto);

        assert.instanceOf(result, ShippingGoodsActionDto);
        assert.equal(result.amount, 100.0);
      });
    });

    context('Transform request body to authorize action dto', () => {
      it('should return AuthorizeActionDto', () => {
        const dto = {
          amount: 100.0,
        };

        const result: AuthorizeActionDto = ActionDtoTransformer.actionToRequestDTO('authorize', dto);

        assert.instanceOf(result, AuthorizeActionDto);
        assert.equal(result.amount, 100.0);
      });
    });

    context('Transform request body by wrong action', () => {
      it('should return null', () => {
        const dto = {
          amount: 100.0,
        };

        const result = ActionDtoTransformer.actionToRequestDTO('test', dto);

        assert.isUndefined(result);
      });
    });
  });
});

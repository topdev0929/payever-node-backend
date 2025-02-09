import 'mocha';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { ActionDescriptionHelper } from '../../../../src/transactions/helpers';
import { PaymentActionsEnum } from '../../../../src/transactions/enum';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('ActionDescriptionHelper', () => {
  describe('get action description', () => {
    it('should return name of the filter', async () => {
      expect(
        ActionDescriptionHelper[PaymentActionsEnum.ShippingGoods],
      ).to.equal('transactions.actions.shipping_goods.description');
    });

    it('should return name of the filter', async () => {
      expect(
        ActionDescriptionHelper[PaymentActionsEnum.Capture],
      ).to.equal('transactions.actions.capture.description');
    });
  });

});

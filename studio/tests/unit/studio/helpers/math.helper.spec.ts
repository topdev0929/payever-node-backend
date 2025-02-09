import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { MathHelper } from '../../../../src/studio/helpers';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('MathHelper', () => {
  describe('pad()', () => {
    it('should add zeros before number to reach the size', () => {
      expect(
        MathHelper.pad(1024, 3),
      ).to.equal('1024');
    });

    it('should add zeros before number to reach the size', () => {
      expect(
        MathHelper.pad(1024, 7),
      ).to.equal('0001024');
    });
  });

  describe('componentToHex()', () => {
    it('should convert number to hex', () => {
      expect(
        MathHelper.componentToHex(1024),
      ).to.equal('400');
    });
  });

  describe('toTwoDecimalDigit()', () => {
    it('should cenvert number to hex', () => {
      expect(
        MathHelper.toTwoDecimalDigit(1024.567843),
      ).to.equal(1024.56);
    });
  });
});

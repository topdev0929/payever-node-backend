import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { UrlHelper } from '../../../../src/studio/helpers';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('UrlHelper', () => {
  describe('getExtention()', () => {
    it('should extract file extension from url', () => {
      expect(
        UrlHelper.getExtention('movie.mov'),
      ).to.equal('mov');
    });
  });
});

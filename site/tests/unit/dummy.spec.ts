import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mocha';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('dummy test', () => {
  before(() => {});

  beforeEach(() => {});

  afterEach(() => {})

  describe('dummy test', () => {
    it('dummy test', async () => {
      expect(true).to.deep.equal(true);
    });
  });
});

import 'mocha';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { AncestorHelper } from '../../../../src/studio/helpers';
import { UserAlbumModel } from '../../../../src/studio/models';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('AncestorHelper', () => {
  describe('buildAncestors()', () => {
    it('should return ancestors with id', () => {
      const model: UserAlbumModel = {
        ancestors: [],
        id: '12345678',
      } as any;
      expect(
        AncestorHelper.buildAncestors(model),
      ).to.deep.equal([
        '12345678',
      ]);
    });

    it('should return ancestors with previous and new value inside it', () => {
      const model: UserAlbumModel = {
        ancestors: [
          '0000000'
        ],
        id: '12345678',
      } as any;
      expect(
        AncestorHelper.buildAncestors(model),
      ).to.deep.equal([
        '0000000',
        '12345678',
      ]);
    });
  });
});
